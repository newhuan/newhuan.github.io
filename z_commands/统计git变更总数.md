# 统计某人最近3个月的代码变更

```bash
git log --since="3 months ago" --author="huhanwen@exiao.tech" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "新增行数: %s, 删除行数: %s, 净增行数: %s\n", add, subs, loc }'
```

