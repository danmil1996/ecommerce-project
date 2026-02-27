export default {
    auth: {
      domain: "dev-o52h3ox6vn4b8b7r.us.auth0.com",
      clientId: "ZMiyI1xjkd8WzJ8dQkfu3yotmRH4WQKU",
      authorizationParams: {
        redirect_uri: "http://localhost:4200",
        audience: "http://localhost:8080",
      },
    },
    httpInterceptor: {
      allowedList: [
        'http://localhost:8080/api/orders/**',
        'http://localhost:8080/api/checkout/purchase'
      ],
    },
  }