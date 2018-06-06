import React from 'react'
import { connect } from 'react-redux'
import Editable from '@thk2b/oui/lib/Editable'
import MdEdit from 'react-icons/lib/md/edit'
import MdCheck from 'react-icons/lib/md/check'
import MdClose from 'react-icons/lib/md/close'

import InputGroup from '../../lib/InputGroup'
import { profilesActions } from '../../../store/modules/profiles'

import OnlineStatus from './OnlineStatus'

const OwnProfileContent = ({ profile, onUpdateProfile }) => {
    return <React.Fragment>
        <InputGroup>
            <Editable
                value={profile.name}
                onSubmit={name => onUpdateProfile({ name })}
                As={({ value, ...props }) => <h1 {...props} >{ value }</h1>}
                With={props => <input {...props} />}
                EditButton={p => <button
                    {...p}
                    style={{backgroundColor: 'transparent'}}
                >
                    <MdEdit size={22}/>
                </button>}
                CancelButton={p => <button {...p}>
                    <MdClose size={22}/>
                </button>}
                SubmitButton={p => <button {...p}>
                    <MdCheck size={22}/>
                </button>}
            />
        </InputGroup>
        <h2>@{profile.userId}{profile.status==='ONLINE'&&<OnlineStatus/>}</h2>
        <p>about</p>
        <InputGroup>
            <Editable
                value={profile.description||'no description yet'}
                onSubmit={description => onUpdateProfile({description})}
                As={({ value, ...props }) => <p {...props}>
                    { value }
                </p>}
                With={props => <textarea {...props}/>}
                EditButton={p => <button
                    {...p}
                    style={{backgroundColor: 'transparent'}}
                >
                    <MdEdit size={22}/>
                </button>}
                CancelButton={p => <button {...p}>
                    <MdClose size={22}/>
                </button>}
                SubmitButton={p => <button {...p}>
                    <MdCheck size={22}/>
                </button>}
            />
        </InputGroup>
    </React.Fragment>    
}

const mapDispatch = dispatch => {
    return {
        updateProfile: (id, data) => dispatch(profilesActions.update(id, data))
    }
}

const mergeProps = (_, { updateProfile }, { profile, ...props }) => {
    return {
        profile,
        onUpdateProfile: data => updateProfile(profile.id, data),
        ...props,
    }
}

export default connect(undefined, mapDispatch, mergeProps)(OwnProfileContent)