Feature: Rudderstack Flow


Scenario Outline: run api automation 
    Given Login to rudderstack web app
    Then Get and store data plane URL
    And Store write key of HTTP source for api call
    Then Use write key and data plane url to call api
    # Then Read and store

    Examples:
        | TestID |
        | RDSTK_TEST001  |