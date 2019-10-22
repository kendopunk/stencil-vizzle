# Axis Tick Formatting

The default tick format specifier is "raw", i.e. display as-is from `chart-data`.  If you have enough control over the transformation of your data prior to attribute assignment, you may keep this default and adjust your metric mappings accordingly.

However, `stencil-vizzle` components offer a variety of baked-in tick formatting functions for both numbers and dates.  For dates, the raw value must be a millisecond timestamp format (1557932000004) or an ISO string ("2019-05-15T14:53:20.004Z").  Under the hood, the formatting functions use `toLocaleString()` and `toLocaleDateString` for numbers and dates, respectively.

In the future `stencil-vizzle` may support `moment` integration, but we'll have to evaluate how this would impact final bundle size.

**Number Formatting**  

| Format Code | Description | Example |
| ----------- | ----------- | ------- |
| "raw" | default, as-is | "1234.5678" => "1234.5678" |
| "localestring" | thousands separator, rounding | "1234.5678" => "1,234.568" |
| "localestring1d" | "localestring" w / one decimal place | "1234.5678" => "1,234.6" |
| "localestring2d" | "localestring" w / two decimal places | "1234.5678" => "1,234.57" |
| "percent" | thousands separator, rounding | "1234.5678" => "1,234.568%" |
| "percent1d" | "percent" w / one decimal place | "1234.5678" => "1,234.6%" |
| "percent2d" | "percent" w / two decimal places | "1234.5678" => "1,234.57%" |
| "USD" | US dollar currency | "1234.5678" => "$1,234.57" |

**Date Formatting**  

| Format Code | Description | Example |
| ----------- | ----------- | ------- |
| "YYYY" | Full year only | 2019 |
| "M/D/YYYY" | No zero prefix | 1/1/2019 |
| "M/D/YY" | 2-digit year | 1/1/19 |
| "MM/DD/YYYY" | With zero prefixes | 01/01/2019 |
| "MMM YYYY" | Month abbreviation and full year | Jan 2019 |
| "MMM D, YYYY" | | Jan 1, 2019 |
| "ISODATE" | `toISOString` | 2019-01-01T14:48:00.000Z |
