Feature: Rudderstack Flow


Scenario Outline: run api automation 
    Given Login to rudderstack web app
    Then Skip two factor authentication
    Then Get and store data plane URL
    And Store write key of HTTP source for api call
    Then Use write key and data plane url to call api
    And Move to events tab in destination <WebHookDev>
    Then Read the events data

    Examples:
        | TestID | WebHookDev |
        | RDSTK_TEST001  | Webhook Dev |