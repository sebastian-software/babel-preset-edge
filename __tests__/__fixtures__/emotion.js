import { css } from "emotion"

const className = css`
  color: hotpink;
`

function SomeComponent() {
  return <div className={className}>Some hotpink text.</div>
}
