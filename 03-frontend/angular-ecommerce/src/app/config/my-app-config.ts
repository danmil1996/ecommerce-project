export default {
    auth: {
      domain: "dev-o52h3ox6vn4b8b7r.us.auth0.com",
      clientId: "ZMiyI1xjkd8WzJ8dQkfu3yotmRH4WQKU",
      authorizationParams: {
        redirect_uri: "https://localhost:4200",
        audience: "https://localhost:8443",
      },
    },
    httpInterceptor: {
      allowedList: [
        'https://localhost:8443/api/orders/**',
        'https://localhost:8443/api/checkout/purchase'
      ],
    },
  }