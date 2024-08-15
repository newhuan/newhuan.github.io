# Spring事件发布器

```java
// 发布事件
import org.springframework.context.ApplicationEventPublisher;

    @Resource
    private ApplicationEventPublisher eventPublisher;
		eventPublisher.publishEvent(new CustomEvent());// CustomEvent不需要继承和实现任何接口和类，就是个POJO

// 接收处理事件
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.event.TransactionalEventListener;

		@Async
    @TransactionalEventListener(value = CustomEvent.class)
    public void handlerCustomEvent(final CustomEvent customEvent) {
      // 处理事件
    }
```

