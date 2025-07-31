package com.kurung.user.controller;

import com.kurung.common.security.service.SessionService;
import com.kurung.common.util.JWTUtil;
import com.kurung.user.dto.UserDTO;
import com.kurung.user.enumeration.Gender;
import com.kurung.user.enumeration.UserPath;
import com.kurung.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/kurung/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SessionService sessionService;
    private final JWTUtil jwtUtil;

    @GetMapping("/tokenuser")
    public ResponseEntity<UserDTO> getMyInfo() {
        return new ResponseEntity<>(sessionService.getUserFromToken(), HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile() {
        try {
            log.info("사용자 프로필 조회 요청");

            // 현재 로그인된 사용자 정보 가져오기
            UserDTO currentUser = sessionService.getUserFromToken();

            // 프로필 정보만 반환 (민감한 정보 제외)
            UserDTO profileDTO = UserDTO.builder()
                .userNick(currentUser.getUserNick())
                .userAge(currentUser.getUserAge())
                .userGender(currentUser.getUserGender())
                .profileImg(currentUser.getProfileImg())
                .build();

            log.info("사용자 프로필 조회 성공 - 사용자: {}", currentUser.getUserId());
            return new ResponseEntity<>(profileDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("사용자 프로필 조회 중 오류 발생", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNickname(@RequestBody UserDTO request) {
        try {
            log.info("닉네임 중복 확인 요청 - 닉네임: {}", request.getUserNick());

            // 닉네임 길이 검증
            if (request.getUserNick() != null && request.getUserNick().length() > 20) {
                log.warn("닉네임 길이 초과 - 닉네임: {}, 길이: {}", request.getUserNick(), request.getUserNick().length());
                Map<String, Boolean> response = new HashMap<>();
                response.put("available", false);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            boolean isAvailable = userService.checkNicknameAvailability(request.getUserNick());

            Map<String, Boolean> response = new HashMap<>();
            response.put("available", isAvailable);

            log.info("닉네임 중복 확인 결과 - 닉네임: {}, 사용가능: {}", request.getUserNick(), isAvailable);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("닉네임 중복 확인 중 오류 발생", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
        @RequestParam("userNick") String userNick,
        @RequestParam("userAge") String userAge,
        @RequestParam("userGender") String userGender,
        @RequestParam(value = "profileImg", required = false) MultipartFile profileImg,
        @RequestParam(value = "existingProfileImg", required = false) String existingProfileImg) {

        try {
            log.info("프로필 업데이트 요청 - 닉네임: {}", userNick);

            // 닉네임 길이 검증
            if (userNick != null && userNick.length() > 20) {
                log.warn("닉네임 길이 초과 - 닉네임: {}, 길이: {}", userNick, userNick.length());
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "닉네임은 20자 이내로 입력해주세요.");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // 현재 로그인된 사용자 정보 가져오기
            UserDTO currentUser = sessionService.getUserFromToken();

            // 프로필 이미지 처리
            String imageUrl = null;
            if (profileImg != null && !profileImg.isEmpty()) {
                // 새 이미지 업로드
                imageUrl = userService.uploadProfileImage(profileImg);
                log.info("프로필 이미지 업로드 완료 - URL: {}", imageUrl);
            } else if (existingProfileImg != null && !existingProfileImg.isEmpty()) {
                // 기존 이미지 유지
                imageUrl = existingProfileImg;
                log.info("기존 프로필 이미지 유지 - URL: {}", imageUrl);
            }

            // 프로필 정보 업데이트
            UserDTO updateDTO = UserDTO.builder()
                .userUuid(currentUser.getUserUuid())
                .userNick(userNick)
                .userAge(LocalDateTime.parse(userAge)) // 문자열을 LocalDateTime으로 변환
                .userGender(Gender.valueOf(userGender)) // 문자열을 Gender enum으로 변환
                .profileImg(imageUrl) // 이미지 URL 설정
                .build();

            // DB 업데이트
            UserDTO updatedUser = userService.updateUserProfile(updateDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "프로필이 성공적으로 업데이트되었습니다.");
            response.put("user", updatedUser);

            log.info("프로필 업데이트 성공 - 사용자: {}", currentUser.getUserId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("프로필 업데이트 중 오류 발생", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "프로필 업데이트 중 오류가 발생했습니다.");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 이미지 파일 제공 엔드포인트 추가
    @GetMapping("/profile/image/{filename}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) {
        try {
            log.info("프로필 이미지 요청 - 파일명: {}", filename);

            // 업로드 디렉토리 경로 설정
            String uploadDir = "uploads/profile";
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                log.info("프로필 이미지 제공 성공 - 파일명: {}", filename);
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // 또는 적절한 이미지 타입
                    .body(resource);
            } else {
                log.warn("프로필 이미지를 찾을 수 없음 - 파일명: {}", filename);
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            log.error("프로필 이미지 제공 중 오류 발생 - 파일명: {}", filename, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserDTO request) {
        try {
            log.info("로그인 요청 - 사용자 ID: {}", request.getUserId());

            // 사용자 인증
            UserDTO userDTO = userService.authenticateUser(request.getUserId(), request.getUserPwd());

            if (userDTO != null) {
                // JWT 토큰 생성
                String accessToken = jwtUtil.generateToken(userDTO, "access");
                String refreshToken = jwtUtil.generateToken(userDTO, "refresh");

                // refresh token을 DB에 저장
                userService.updateRefresh(userDTO, refreshToken);

                // 새로운 UserDTO 객체를 생성하여 토큰 포함
                UserDTO responseDTO = UserDTO.builder()
                    .userUuid(userDTO.getUserUuid())
                    .userId(userDTO.getUserId())
                    .userNick(userDTO.getUserNick())
                    .userPath(userDTO.getUserPath())
                    .profileImg(userDTO.getProfileImg())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();

                log.info("로그인 성공 - 사용자 ID: {}", request.getUserId());
                return new ResponseEntity<>(responseDTO, HttpStatus.OK);
            } else {
                log.warn("로그인 실패 - 잘못된 인증 정보 - 사용자 ID: {}", request.getUserId());
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            log.error("로그인 처리 중 오류 발생", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(userService.registerUserWithResponse(userDTO), HttpStatus.OK);
    }

    @GetMapping("/check-userid")
    public ResponseEntity<Boolean> checkuserId(@RequestParam String userId) {
        return new ResponseEntity<>(userService.checkUserIdAvailability(userId), HttpStatus.OK);
    }

    @PostMapping("/check-email-duplicate")
    public ResponseEntity<Boolean> checkEmailDuplicate(@RequestBody UserDTO request) {
        try {
            log.info("이메일 중복 체크 요청 - 이메일: {}", request.getEmail());

            boolean isDuplicate = userService.checkEmailDuplicate(request.getEmail());

            log.info("이메일 중복 체크 결과 - 이메일: {}, 중복: {}", request.getEmail(), isDuplicate);
            return new ResponseEntity<>(isDuplicate, HttpStatus.OK);
        } catch (Exception e) {
            log.error("이메일 중복 체크 중 오류 발생", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/kakao/login")
    public ResponseEntity<UserDTO> kakaoLogin(@RequestBody UserDTO request) {
        return new ResponseEntity<>(userService.socialLoginWithResponse(request.getSocialToken(), UserPath.KAKAO), HttpStatus.OK);
    }

    @PostMapping("/naver/login")
    public ResponseEntity<UserDTO> naverLogin(@RequestBody UserDTO request) {
        return new ResponseEntity<>(userService.socialLoginWithResponse(request.getSocialToken(), UserPath.NAVER), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        try {
            log.info("로그아웃 요청 시작");

            // JWT 토큰에서 사용자 정보 추출 (메서드명 수정)
            String userUuid = jwtUtil.getUserUuidFromToken(token.replace("Bearer ", ""));

            // DB에서 refresh token 삭제
            userService.clearRefreshToken(userUuid);

            // 소셜 로그인인 경우 토큰 해제 (선택사항)
            UserDTO userInfo = userService.getUserByUuid(userUuid);
            if (userInfo.getUserPath() == UserPath.KAKAO) {
                log.info("카카오 사용자 로그아웃 - 토큰 해제 생략");
                // 카카오 토큰 해제 (선택사항)
                // kakaoOAuthClient.revokeToken(accessToken);
            } else if (userInfo.getUserPath() == UserPath.NAVER) {
                log.info("네이버 사용자 로그아웃 - 토큰 해제 생략");
                // 네이버 토큰 해제 (선택사항)
                // naverOAuthClient.revokeToken(accessToken);
            }

            log.info("로그아웃 완료 - 사용자: {}", userUuid);
            return new ResponseEntity<>("로그아웃이 완료되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생", e);
            return new ResponseEntity<>("로그아웃 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<String> sendVerificationCode(@RequestBody UserDTO request) {
        userService.sendVerificationCode(request);
        return new ResponseEntity<>("인증번호가 발송되었습니다.", HttpStatus.OK);
    }

    @PostMapping("/confirm-verification-code")
    public ResponseEntity<String> confirmVerificationCode(@RequestBody UserDTO request) {
        boolean isValid = userService.confirmVerificationCode(request);
        return new ResponseEntity<>(isValid ? "인증번호가 확인되었습니다." : "인증번호가 일치하지 않습니다.",
            isValid ? HttpStatus.OK : HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/reset-password-by-email")
    public ResponseEntity<UserDTO> resetPasswordByEmail(@RequestBody UserDTO request) {
        return new ResponseEntity<>(userService.resetPasswordByEmail(request), HttpStatus.OK);
    }
} 