package com.kurung.user.social.client;

import com.kurung.user.social.dto.NaverUserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class NaverOAuthClient {

    private final RestTemplate restTemplate;

    @Value("${social.naver.api-url:https://openapi.naver.com}")
    private String naverApiUrl;

    /**
     * 네이버 액세스 토큰으로 사용자 정보 조회
     * @param accessToken 네이버 액세스 토큰
     * @return 네이버 사용자 정보
     */
    public NaverUserInfo getUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = naverApiUrl + "/v1/nid/me";
            ResponseEntity<NaverUserInfo> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, NaverUserInfo.class);

            log.info("네이버 사용자 정보 조회 성공");
            return response.getBody();

        } catch (Exception e) {
            log.error("네이버 사용자 정보 조회 실패: {}", e.getMessage());
            throw new RuntimeException("네이버 사용자 정보 조회에 실패했습니다.", e);
        }
    }

    /**
     * 네이버 토큰 유효성 검증
     * @param accessToken 네이버 액세스 토큰
     * @return 유효성 여부
     */
    public boolean validateToken(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = naverApiUrl + "/v1/nid/me";
            ResponseEntity<Object> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Object.class);

            log.info("네이버 토큰 유효성 검증 성공");
            return response.getStatusCode().is2xxSuccessful();

        } catch (Exception e) {
            log.error("네이버 토큰 유효성 검증 실패: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 네이버 인증 코드로 액세스 토큰 받기
     * @param code 네이버 인증 코드
     * @return 네이버 액세스 토큰
     */
    public String getAccessToken(String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", "네이버_클라이언트_ID");  // 실제 네이버 클라이언트 ID로 변경 필요
            params.add("client_secret", "네이버_클라이언트_시크릿");  // 실제 네이버 클라이언트 시크릿으로 변경 필요
            params.add("redirect_uri", "http://localhost:3000/auth/naver/callback");
            params.add("code", code);
            params.add("state", "state");  // CSRF 방지를 위한 state 값

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<NaverTokenResponse> response = restTemplate.postForEntity(
                "https://nid.naver.com/oauth2.0/token",
                request,
                NaverTokenResponse.class
            );

            log.info("네이버 액세스 토큰 받기 성공");
            return response.getBody().getAccess_token();

        } catch (Exception e) {
            log.error("네이버 액세스 토큰 받기 실패: {}", e.getMessage());
            throw new RuntimeException("네이버 인증에 실패했습니다.", e);
        }
    }

    /**
     * 네이버 토큰 응답 DTO
     */
    @lombok.Data
    public static class NaverTokenResponse {
        private String access_token;
        private String refresh_token;
        private String token_type;
        private Integer expires_in;
        private String error;
        private String error_description;
    }
} 