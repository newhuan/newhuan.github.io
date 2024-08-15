# Spring实现策略选择器

## 实现方式一

```java
import org.springframework.context.event.EventListener;

@Component
public class ExportServiceSelector {

    private ImmutableMap<String, ChartExport> chartExportSvcMap;

    @EventListener(ApplicationReadyEvent.class)
    public void init(ApplicationReadyEvent event) {
        ConfigurableApplicationContext applicationContext = event.getApplicationContext();
        Map<String, ChartExport> serviceMap = applicationContext.getBeansOfType(ChartExport.class);
        if (MapUtils.isEmpty(serviceMap)) {
            chartExportSvcMap = ImmutableMap.<String, ChartExport>builder().build();
            return;
        }

        ImmutableMap.Builder<String, ChartExport> builder = ImmutableMap.builder();
        for (Map.Entry<String, ChartExport> entry : serviceMap.entrySet()) {
            builder.put(entry.getValue().getType(), entry.getValue());
        }

        chartExportSvcMap = builder.build();
    }
}
```

## 实现方式二

```java
package com.qflow.qingbi.chart.component;

import com.google.common.collect.ImmutableMap;
import com.qflow.qingbi.chart.bo.AbstractChartConfig;
import com.qflow.qingbi.chart.bo.querysqlbo.AbstractChartQuerySqlBO;
import com.qflow.qingbi.chart.service.AbstractChartService;
import org.apache.commons.collections4.MapUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;// Spring生命周期hook方法，afterPropertiesSet
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;// 注入applicationContext
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 报表服务策略选择器.
 *
 * @author 王臻
 * @version 1.0
 * @since 2021/05/20
 */
@Component
public class ChartServiceSelector implements InitializingBean, ApplicationContextAware {

    private ApplicationContext applicationContext;

    private ImmutableMap<String, AbstractChartService<? extends AbstractChartConfig, ? extends AbstractChartQuerySqlBO>> chartSvcMap;

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    @SuppressWarnings("unchecked")
    public void afterPropertiesSet() {
        Map<String, AbstractChartService> serviceMap = applicationContext.getBeansOfType(AbstractChartService.class);
        if (MapUtils.isEmpty(serviceMap)) {
            chartSvcMap =
                    ImmutableMap.<String, AbstractChartService<? extends AbstractChartConfig, ? extends AbstractChartQuerySqlBO>>builder().build();
            return;
        }
        ImmutableMap.Builder<String, AbstractChartService<? extends AbstractChartConfig, ? extends AbstractChartQuerySqlBO>>
                builder = ImmutableMap.builder();
        for (Map.Entry<String, AbstractChartService> entry : serviceMap.entrySet()) {
            builder.put(entry.getValue().getType(), entry.getValue());
        }
        chartSvcMap = builder.build();
    }

    public AbstractChartService<? extends AbstractChartConfig, ? extends AbstractChartQuerySqlBO> getChartService(String type) {
        return chartSvcMap.get(type);
    }

}
```

