# Test Guide

- Only valid transaction requests are passed to porfolio related utils, so we don't need to test for exceptional cases.

- Group test tasks in seperate source files for easier debugging.

- Before creating actual test cases, review mock data flow/action as table in TARGET.test-plan-TASKNAME.md, you should update/amend data if deemed necessary.

- For commission value, if commission exists, use the lot price as commission, for easier manual review.

- For all rate/ratio related actions, (tax, split ect) use 0.5 and/or 2 for easier manual review.

- For all other numbers, prefer simple calculation.
