# Rudderstack Automation Test

## Overview

The project contains test involving end-2-end testing
for Rudderstack login, API call and Event Tracking using
Webdriver.IO. It validates the event count of API calls
on the dashboard.

## Features

- _User Authentication_: Automates login to the Rudderstack with real credentials
- _API Integration_: Sends events via Rudderstack webhook destinations
- _Event Tracking_: Verifies are correctly displayed on the dashboard
- _Tab Navigation_: Tests UI navigation through different sections such as 2fA, events, dashboard
- _Assertion Validation_: Validates delivered and failed events as expected outcomes

## Prerequisites

- _Node.js_ version 20.16 or higher
- _npm_ (Node Package Manager)
- _Chromium_ browser (installed automatically via workflow or locally)

## Technology used

- _Node.js_ (v20.16)

- _WebdriverIO_

- _Cucumber (Gherkin)_

- _TypeScript_

- _npm_

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Sheikh-Fahad-Ahmed/rudderstack-automation-test.git
   cd rudderstack-automation-test
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:

   ```
   STANDARD_USER=your_test_username
   STANDARD_PASSWORD=your_test_password
   RUDDERSTACK_LOGIN_URL=https://rudderstack-login-url.com

   ```

## Running Tests

### Run all tests locally:

```bash
npx wdio wdio.conf.ts
```

## CI/CD Integration

Tests run automatically via GitHub Actions on:

- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch
- Scheduled runs (daily at 8 AM IST)
