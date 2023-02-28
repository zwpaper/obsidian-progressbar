# Obsidian ProgressBar

This is a code block plugin for Obsidian (https://obsidian.md) generating a progressbar.

Obsidian ProgressBar plugin can render the `progressbar` code block
into a progressbar based on Time or Manually,
which support:
- **day-year**: a progress bar showing how many days passed in this year.
- **day-month**: a progress bar showing how many days passed in this month.
- **day-week**: a progress bar showing how many days passed in this week.
- **month**: a progress bar showing how many months passed in this year.
- **manual**: a progress bar specified by user

![all kinds](./images/all-kinds.jpg)

## Configuration

Obsidian ProgressBar plugin will work when creating a `progressbar` code block,
and use [Yaml](https://yaml.org/) to configure.

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
# Optional if manually specifying value
# Possible values: day-year, day-month, day-week, month
kind: day-year

# == name ==
# Specify the progress bar name, in front of the bar
# Optional, will use kind as name if not specified
name: day-year

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

# == max ==
# Specify the progress bar max value
# Optional when specified a valid kind
# Required when not having a kind
# Possible format: numbers
max: 25
```
