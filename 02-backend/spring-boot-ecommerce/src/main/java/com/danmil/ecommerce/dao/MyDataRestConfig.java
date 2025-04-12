package com.danmil.ecommerce.dao;

import com.danmil.ecommerce.entity.Country;
import com.danmil.ecommerce.entity.Product;
import com.danmil.ecommerce.entity.ProductCategory;
import com.danmil.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration (RepositoryRestConfiguration config, CorsRegistry cors) {
        disableHttpMethods (config);
        exposeIds (config);
    } // configureRepositoryRestConfiguration

    private void disableHttpMethods (RepositoryRestConfiguration config) {
        // POST, PUT, DELETE are disabled so these entities are in ReadOnly.
        HttpMethod[] unsupportedMethods = { HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE };
        disableUnsupportedMethods (config, unsupportedMethods, Product.class);
        disableUnsupportedMethods (config, unsupportedMethods, ProductCategory.class);
        disableUnsupportedMethods (config, unsupportedMethods, State.class);
        disableUnsupportedMethods (config, unsupportedMethods, Country.class);
    } // disableHttpMethods

    /**
     * Disable for a class http methods in input
     */
    private void disableUnsupportedMethods (RepositoryRestConfiguration config, HttpMethod[] unsupportedMethods, Class<?> type) {
        config.getExposureConfiguration ()
                .forDomainType (type)
                .withItemExposure (((metdata, httpMethods) -> httpMethods.disable (unsupportedMethods)))
                .withCollectionExposure (((metdata, httpMethods) -> httpMethods.disable (unsupportedMethods)));
    } // disableUnsupportedMethods

    private void exposeIds (RepositoryRestConfiguration config) {
        // Array of entity types
        var entityClasses = new ArrayList<Class> ();
        // Get entity types for the entities.
        entityManager.getMetamodel()
                .getEntities()
                .forEach (tmpType ->
                        entityClasses.add (tmpType.getJavaType()));
        // Expose the entity ids for the array of entity/domain types
        config.exposeIdsFor(entityClasses.toArray(new Class[0]));
    } // exposeIds

}
