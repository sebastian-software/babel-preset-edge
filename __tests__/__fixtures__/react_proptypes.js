import React from "react"
import PropTypes from "prop-types"

class MyComponent extends React.Component {
  render() {
    return <div>{this.props.userName}</div>
  }
}

MyComponent.propTypes = {
  userName: PropTypes.string
}
