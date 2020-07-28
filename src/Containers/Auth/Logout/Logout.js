import React, { useEffect } from 'react'
import * as actions from '../../../store/actions/index'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const Logout = props => {
    useEffect(() => {
        props.onLogout()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return <Redirect to='/' />

}
const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    }
}
export default connect(null, mapDispatchToProps)(Logout)