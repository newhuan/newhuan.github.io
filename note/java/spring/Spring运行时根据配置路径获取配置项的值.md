# 运行时根据配置路径，获取配置项的值

```java
private int getTimeoutPeriod() {
        String propertyPath = "downloadUrlConnectionProperties.downloadSocketTimeout";
        String timeoutConfigBeanName = propertyPath.split("\\.")[0];
        String timeoutConfigFieldName = propertyPath.split("\\.")[1];
        ExpressionParser parser = new SpelExpressionParser();
        Expression exp = parser.parseExpression(timeoutConfigFieldName);
        EvaluationContext context = new StandardEvaluationContext(applicationContext.getBean(timeoutConfigBeanName));
        return (int) exp.getValue(context);
    }
```

