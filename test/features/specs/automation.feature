Feature: Rudderstack Flow

@e2e @authentication @integration
Scenario Outline: Login and verify API event count
    Given Login to rudderstack web app
    When Logged in skip two factor authentication
    Then Get and store data plane URL
    And Store write key of HTTP source for api call
    Then Use write key and data plane url to call api
    And Move to events tab in destination <WebHookDev>
    Then Read the events data

    Examples:
        | TestID | WebHookDev |
        | RDSTK_TEST001  | Webhook Dev |