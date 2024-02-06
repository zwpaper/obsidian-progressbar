English | [简体中文](./README.zh-CN.md)

<h1 align="center">Obsidian ProgressBar</h1>

<p align=center>
<a href="https://github.com/zwpaper/obsidian-progressbar/releases/latest"><img src="https://img.shields.io/github/v/release/zwpaper/obsidian-progressbar" alt="release" /></a>
<a href="https://github.com/zwpaper/obsidian-progressbar/actions/workflows/ci.yml"><img alt="continuous integration" src="https://github.com/zwpaper/obsidian-progressbar/actions/workflows/ci.yml/badge.svg"></a>
<a href="https://opensource.org/licenses/Apache-2.0">
<img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="license" />
</a>
</p>

This is a code block plugin for Obsidian (https://obsidian.md) generating a progressbar.

Obsidian ProgressBar plugin can render the `progressbar` code block
into a progressbar based on Time or Manually,
which support:
- **day-year**: a progress bar showing how many days passed in this year.
- **day-month**: a progress bar showing how many days passed in this month.
- **day-week**: a progress bar showing how many days passed in this week.
- **day-custom**: a progress bar showing how many days passed in custom start and end.
- **month**: a progress bar showing how many months passed in this year.
- **manual**: a progress bar specified by user

![all kinds](./images/all-kinds.jpg)

## Configuration

Obsidian ProgressBar plugin will work when creating a `progressbar` code block,
and use [Yaml](https://yaml.org/) to configure.

the name is showing as the description before the progressbar,
and it support templates, please refer to the [Name Templates](#name-templates).

for example:

```
    ```progressbar
    kind: day-year
    name: This Year
    ```
```

will generate:

![this year](./images/this-year.jpg)

### supported configurations

This is the example configuration obsidian progressbar support with some remarks

``` yaml
# == kind ==
# Required when specifying a time based progress bar
#
# Optional if manually specifying value
#
# Possible values:
#   day-year:
#   day-month:
#   day-week:
#   month:
#   day-custom: min, and max is required, both min and max should in format: YYYY-MM-DD
kind: day-year

# == name ==
# Specify the progress bar name, in front of the bar
# support templates: max, value, percentage
#
# quote is recommanded if templates are used
#
# Optional, will use kind as name if not specified
name: name: "{percentage} from {min} to {max}"

# == width ==
# Specify the progress bar width
# Optional
# Possible format: 50%, 100px
width: 50%

# == value ==
# Specify the progress bar current value
# Optional when specified a valid kind
# Required when not having a kind
# Possible format: numbers
value: 10

# == min ==
# Specify the progress bar max value
#
# Optional when specified a valid kind
# Only Required when kind is day-custom
#
# Possible format:
#   day-custom: YYYY-MM-DD
#   others: number
max: 2024-02-01

# == max ==
# Specify the progress bar max value
#
# Optional when specified a valid kind
# Required when not having a kind
#
# Possible format: numbers
#   day-custom: YYYY-MM-DD
#   others: number
max: 2024-04-30
```


### Name Templates

the `name` option for `progressbar` supports the following templates:
- max
- value
- percentage

it can be used in format `{max}`,
the plugin will replace it to the real value automatically.

for example, `currently is {value}, it's {percentage} to {max}`
will produce: `currently is 123, it's 34% to 365`.

the no supported template will no be changed, for example, `I am {unknown}`,
will still stay as `I am {unknown}`.

If no name specified, name will be `kind({percentage})` by default.
