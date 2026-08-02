# feature: Stepper

## contexto
component to navigate between form steps


## functional requests 
- the user cant be navigate taping in stepper

## behavior requests
- the stepper have been 2 lines, in the first line aligned to left the text 'Passo {current step} de {number of steps}' and aligned to right {step name}, in the second line create an progress bar with is filled when steps progress

## tecnical notes
- use colors from @global.css
- for the progress bar base color is color-neutral-700 and when filled color is color-orange-500
- left text color is color-orange-200
- the right text color is color-neutral-200
- the gap between the two lines is 8px(use rem)

