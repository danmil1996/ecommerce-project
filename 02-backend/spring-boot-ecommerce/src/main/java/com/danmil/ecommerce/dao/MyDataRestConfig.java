package com.danmil.ecommerce.dao;

import com.danmil.ecommerce.entity.Product;
import com.danmil.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration (RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedMethods = { HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE };
        disableUnsupportedMethods (config, unsupportedMethods, Product.class);
        disableUnsupportedMethods (config, unsupportedMethods, ProductCategory.class);
    } // configureRepositoryRestConfiguration

    /**
     * Disable for a class http methods in input
     */
    private void disableUnsupportedMethods (RepositoryRestConfiguration config, HttpMethod[] unsupportedMethods, Class<?> type) {
        config.getExposureConfiguration ()
                .forDomainType (type)
                .withItemExposure (((metdata, httpMethods) -> httpMethods.disable (unsupportedMethods)))
                .withCollectionExposure (((metdata, httpMethods) -> httpMethods.disable (unsupportedMethods)));
    } // disableUnsupportedMethods

}
