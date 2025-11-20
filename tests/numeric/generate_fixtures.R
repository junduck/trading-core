#!/usr/bin/env Rscript
# Generate test fixtures for numeric stats validation

# Install moments package if not already installed
if (!require("moments", quietly = TRUE)) {
  install.packages("moments", repos = "https://cloud.r-project.org")
  library(moments)
}

set.seed(42)

# Test case 1: Small integer values
x1 <- c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
y1 <- c(2, 4, 6, 4, 10, 8, 14, 8, 18, 10)

# Test case 2: Larger floating point values with more variance
x2 <- c(100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5)
y2 <- c(50.2, 51.1, 49.8, 50.5, 49.9, 51.5, 49.5, 50.3, 51.2, 50.0)

# Test case 3: Random normal distribution (larger sample)
x3 <- rnorm(50, mean = 100, sd = 15)
y3 <- x3 * 0.8 + rnorm(50, mean = 10, sd = 5)

# Helper to format number with high precision
fmt <- function(x) {
  sprintf("%.16g", x)
}

# Helper to format array
fmt_array <- function(x) {
  paste0("[", paste(sapply(x, fmt), collapse = ", "), "]")
}

# Helper to output test case
output_case <- function(name, x, y) {
  cat(sprintf("\n// %s\n", name))
  cat(sprintf("const x = %s;\n", fmt_array(x)))
  cat(sprintf("const y = %s;\n", fmt_array(y)))
  cat(sprintf("// mean(x) = %s\n", fmt(mean(x))))
  cat(sprintf("// variance(x, ddof=0) = %s\n", fmt(var(x) * (length(x) - 1) / length(x))))
  cat(sprintf("// variance(x, ddof=1) = %s\n", fmt(var(x))))
  cat(sprintf("// stddev(x, ddof=1) = %s\n", fmt(sd(x))))
  cat(sprintf("// skew(x) = %s\n", fmt(skewness(x))))
  cat(sprintf("// kurt(x) = %s (excess kurtosis)\n", fmt(kurtosis(x) - 3)))
  cat(sprintf("// cov(x, y, ddof=1) = %s\n", fmt(cov(x, y))))
  cat(sprintf("// corr(x, y) = %s\n", fmt(cor(x, y, method = "pearson"))))
  cat(sprintf("// spearman(x, y) = %s\n", fmt(cor(x, y, method = "spearman"))))
}

cat("// Test fixtures generated from R\n")
cat("// Generated with: Rscript tests/numeric/generate_fixtures.R\n")

output_case("Case 1: Small integer values", x1, y1)
output_case("Case 2: Floating point values", x2, y2)
output_case("Case 3: Random normal distribution", x3, y3)

cat("\n// Additional edge cases\n")
cat(sprintf("// mean([1, 2, 3]) = %s\n", fmt(mean(c(1, 2, 3)))))
cat(sprintf("// variance([1, 2, 3], ddof=0) = %s\n", fmt(var(c(1, 2, 3)) * 2 / 3)))
cat(sprintf("// variance([1, 2, 3], ddof=1) = %s\n", fmt(var(c(1, 2, 3)))))
