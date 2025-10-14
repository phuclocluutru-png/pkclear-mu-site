<?php
/**
 * API helpers for PK Clear rankings.
 *
 * @package muonline
 */

if ( ! function_exists( 'muonline_get_api_base' ) ) {
	/**
	 * Resolve API base URL.
	 */
	function muonline_get_api_base(): string {
		$default_base = home_url( '/API/public/index.php' );
		$base         = defined( 'PKCLEAR_API_BASE' ) ? PKCLEAR_API_BASE : $default_base;

		return apply_filters( 'muonline_api_base', $base );
	}
}

if ( ! function_exists( 'muonline_get_api_token' ) ) {
	/**
	 * Resolve API token.
	 */
	function muonline_get_api_token(): string {
		$token = defined( 'PKCLEAR_API_TOKEN' ) ? PKCLEAR_API_TOKEN : '';

		return apply_filters( 'muonline_api_token', $token );
	}
}

if ( ! function_exists( 'muonline_fetch_api' ) ) {
	/**
	 * Fetch data from PK Clear API.
	 */
	function muonline_fetch_api( string $endpoint, array $args = array(), int $cache_ttl = 60 ) {
		$base_url = muonline_get_api_base();

		if ( empty( $base_url ) ) {
			return new WP_Error( 'muonline_api_missing_base', __( 'Chưa cấu hình địa chỉ API.', 'muonline' ) );
		}

		$token = muonline_get_api_token();
		if ( empty( $token ) ) {
			return new WP_Error( 'muonline_api_missing_token', __( 'Chưa cấu hình API token. Vui lòng đặt PKCLEAR_API_TOKEN trong wp-config.php.', 'muonline' ) );
		}

		$query_args = array_merge(
			array(
				'endpoint' => $endpoint,
				'token'    => $token,
			),
			$args
		);

		$request_url = add_query_arg( $query_args, $base_url );
		$cache_ttl   = (int) apply_filters( 'muonline_api_cache_ttl', $cache_ttl, $endpoint );
		$cache_key   = 'muonline_api_' . md5( $request_url );

		$cached = get_transient( $cache_key );
		if ( false !== $cached ) {
			return $cached;
		}

		$response = wp_remote_get(
			$request_url,
			array(
				'timeout' => 10,
				'headers' => array(
					'Accept' => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$status_code = wp_remote_retrieve_response_code( $response );
		if ( $status_code >= 400 ) {
			return new WP_Error(
			 'muonline_api_http_error',
			 sprintf(
				 /* translators: %d: HTTP status code */
				 __( 'Máy chủ xếp hạng trả về mã lỗi %d.', 'muonline' ),
				 $status_code
			 )
			);
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		if ( null === $data && '' !== trim( (string) $body ) ) {
			return new WP_Error( 'muonline_api_invalid_json', __( 'Không thể đọc dữ liệu trả về từ API.', 'muonline' ) );
		}

		set_transient( $cache_key, $data, max( $cache_ttl, 1 ) );

		return $data;
	}
}

if ( ! function_exists( 'muonline_get_top_characters' ) ) {
	/**
	 * Fetch top characters from API.
	 */
	function muonline_get_top_characters( int $limit = 5 ) {
		$data = muonline_fetch_api( 'ranking' );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		if ( ! is_array( $data ) ) {
			return array();
		}

		return array_slice( $data, 0, max( $limit, 1 ) );
	}
}

if ( ! function_exists( 'muonline_get_top_guilds' ) ) {
	/**
	 * Fetch top guilds from API.
	 */
	function muonline_get_top_guilds( int $limit = 5 ) {
		$data = muonline_fetch_api( 'guild' );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		if ( ! is_array( $data ) ) {
			return array();
		}

		return array_slice( $data, 0, max( $limit, 1 ) );
	}
}
