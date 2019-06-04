// Project relative import to missing file
import { Button } from '-/components/button/Button'

// Project relative import to existing file
import { logx } from '-/testonly'

// This is probably shown as okay by TS validation, but is not supported by Babel
import 'src/testonly'

logx(Button)
