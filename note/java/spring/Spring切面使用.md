# Spring切面使用

**注意： 因为Spring的切面的实现方式，所以切面生效必须得保证切面标记的方法被调用时，是跨class的方法调用，也就是被标记方法必须是public的接口方法，同时被调用时必须是被其他class调用，此时切面才会生效。**

想跨过上面的限制，可以用AspectJ替换Spring的切面实现.

```java
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import com.qingflow.base.application.worksheet.data.component.annotation.WorksheetContextCache;
import org.apache.commons.beanutils.PropertyUtils;

@Aspect
@Component
@ConditionalOnClass(WorksheetContextCache.class)
public class WorksheetContextCacheAspect {
  
  private static final String POINT_ANNOTATION = "@annotation(com.qingflow.base.application.worksheet.data.component.annotation.WorksheetContextCache)";

    // 此处定义一个可重用的切面，含义为给所有带[POINT_ANNOTATION]注解的方法或者class都定义切面
    @Pointcut(POINT_ANNOTATION)
    private void operator() {
    }

    @Around("operator()")// 在上方被定义的切面方法前后执行
    private Object around(ProceedingJoinPoint joinPoint) throws Throwable {
      // 在方法执行前做些处理
      Object[] args = joinPoint.getArgs();
      Object formIdObj;
      Integer formId = null;
      Object engineBO = null;
      for (Object arg : args) {
          if (arg instanceof AbstractEngineBO && Objects.isNull(engineBO)) {
              engineBO = arg;
          }
          // 获取属性
          formIdObj = PropertyUtils.getProperty(arg, "formId");
          if (Objects.isNull(formIdObj)) {
              continue;
          }
          if (NumberUtils.isDigits(formIdObj.toString())) {
              formId = Integer.valueOf(formIdObj.toString());
              break;
          }
      }
      if (Objects.isNull(formId)) {
          throw new NullPointerException("FormId is null.");
      }
      Object result;
      try {
          // 这是个工厂的例子
          assembleCache(formId);
          if (Objects.nonNull(engineBO)) {
              PropertyUtils.setProperty(engineBO, "cache", workFlowCacheFactory.getCache());
          }
	        // 执行被定义切面的方法
          result = joinPoint.proceed();// 被切面方法的签名是否返回void不影响这里
      } finally {
	        // 在方法执行后做些处理
          workFlowCacheFactory.removeCache();
      }
      return result;
    }
  
		// 组装cache
    private void assembleCache(Integer formId) {
        List<AuditNode> auditNodes = auditNodeMapper.listByFormId(formId);
        //获得数据流中所有nodeId和对应的数据结构的映射关系
        workFlowCacheFactory.setCache(auditNodes);
    }
}
```

```java
package com.qflow.backend.workflow.engine.common.cache.annotation;

import com.qflow.backend.model.AuditNode;
import com.qflow.backend.workflow.engine.common.cache.attribute.GenericNode;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 节点缓存工厂.
 *
 * @author hanmeng
 * @since 2023/01/01
 */
@Component
public final class WorkflowCacheFactory {

    private static final ThreadLocal<WorkflowCache> CACHE_THREAD_LOCAL = new ThreadLocal<>();

    private WorkflowCacheFactory() {
    }

    // 工厂方法
    void setCache(List<AuditNode> list) {
        WorkflowCache cache = new WorkflowCache();
        for (AuditNode auditNode : list) {
            GenericNode genericNode = new GenericNode(auditNode);
            cache.put(genericNode.getNodeId(), genericNode);
            if (genericNode.isRootNode()) {
                cache.setRootNode(genericNode);
            }
        }
        CACHE_THREAD_LOCAL.set(cache);
    }

    void removeCache() {
        CACHE_THREAD_LOCAL.remove();
    }

    public WorkflowCache getCache() {
        return CACHE_THREAD_LOCAL.get();
    }

    public GenericNode getNode(Integer nodeId) {
        return getCache().get(nodeId);
    }

    /**
     * 是否包含指定的key.
     *
     * @param nodeId 节点id.
     * @return true:包含;false:不包含.
     */
    public boolean containsKey(Integer nodeId) {
        return getCache().containsKey(nodeId);
    }

}
```

