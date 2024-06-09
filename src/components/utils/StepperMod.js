import React from "react";
import { Icon } from "@mui/material";
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';


export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 13,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        // backgroundImage:'linear-gradient(90deg, rgba(47,160,47,0.7) 50%, rgba(15,128,170,0.7) 90%)'
        backgroundColor:'rgba(47,160,47,0.7)'
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor:'rgba(47,160,47,0.7)'
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 15,
      border: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
    },
}));

  
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 42,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundColor:'#0f80aa',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundColor:'rgba(47,160,47,1)'
    }),
  }));


  export const ColorlibStepIcon = (props) => {
    const { active, completed, className } = props;
  
    const icons = {
        1: <Icon class="material-symbols-outlined">clinical_notes</Icon>,
        2: <Icon class="material-symbols-outlined">airport_shuttle</Icon>,
        3: <Icon class="material-symbols-outlined">format_list_bulleted</Icon>,
        4: <Icon class="material-symbols-outlined" style={{color:'rgb(204, 163, 103)'}}>devices</Icon>,
        5: <Icon class="material-symbols-outlined">contract_edit</Icon>,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  
ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };