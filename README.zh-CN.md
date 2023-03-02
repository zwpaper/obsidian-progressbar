[English](./README.md) | 简体中文

<h1 align="center">Obsidian ProgressBar</h1>

<p align=center>
<a href="https://github.com/zwpaper/obsidian-progressbar/releases/latest"><img src="https://img.shields.io/github/v/release/zwpaper/obsidian-progressbar" alt="release" /></a>
<a href="https://github.com/zwpaper/obsidian-progressbar/actions/workflows/ci.yml"><img alt="continuous integration" src="https://github.com/zwpaper/obsidian-progressbar/actions/workflows/ci.yml/badge.svg"></a>
<a href="https://opensource.org/licenses/Apache-2.0">
<img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="license" />
</a>
</p>

这是一个 [Obsidian](https://obsidian.md) 的代码块插件，用于使用代码块生成各种进度条。

主要作用是将 progressbar 格式的代码块渲染为基于时间或手动的进度条，支持以下几种进度条：

- day-year：显示今年过去了多少天的进度条。
- day-month：显示本月过去了多少天的进度条。
- day-week：显示本周过去了多少天的进度条。
- month：显示今年过去了多少个月的进度条。
- manual：由用户指定的进度条。

![all kinds](./images/all-kinds.jpg)

## 配置手册

Obsidian ProgressBar 插件会检测 `progressbar` 类型的代码块，并使用 Yaml 进行配置。

例如：

```
    ```progressbar
    kind: day-year
    name: This Year
    ```
```

将会生成如下进度条：

![this year](./images/this-year.jpg)


### 支持的配置项

这是 Obsidian ProgressBar 支持的示例配置，其中包含一些说明：



```yaml
# == kind ==
# 当指定基于时间的进度条时必填
# 如果手动指定值，则可选
# 可选项：day-year、day-month、day-week、month
kind: day-year

# == name ==
# 指定进度条名称，在进度条前面显示
# 可选，如果未指定，将使用 kind 作为名称
name: day-year

# == width ==
# 指定进度条宽度
# 可选
# 可选格式：50%、100px
width: 50%

# == value ==
# 指定进度条当前值
# 如果指定了有效的 kind，则可选
# 如果未指定 kind，则必填
# 格式：数字
value: 10

# == max ==
# 指定进度条最大值
# 如果指定了有效的 kind，则可选
# 如果未指定 kind，则必填
# 格式：数字
max: 25
```
