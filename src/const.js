const constant = {
    /**
     * Server port
     */
    PORT: 8080,
    SRVR_ERR: 'Internal server error ',
    MSG:{
        AUTH: {
            CHANGE:{
                CATEGORY: {
                    SUCCESS: 'Account has been successfully changed',
                    FAIL: 'Account can\'t be changed, due to internal server error.'
                },
                INVALID: 'Invalid configuration parameters.',
                PWD:{
                    INVALID: 'Old password did not match!',
                    SUCCESS: 'Successfully changed a password.',
                    FAIL: 'Failed to change a password, due to internal server error.'
                },
                STDID:{
                    FAIL: 'Failed to change Student ID.',
                    INVALID: 'Student ID is invalid.',
                    SUCCESS: 'Successfully changed student ID'
                }
            },
            REG_SUCCESS: 'Registeration is successful.',
            DATA_INVALID: 'Data you have entered is invalid.',
            USR_TYPE_INVALID: 'User type chosen is invalid.',
            USR_TOO_SHORT: 'Your username is too short.',
            USR_NOT_EXIST: 'User is not exist.',
            USR_EXIST: 'This user ID is already taken.',
            PWD_TOO_SHORT: 'Your password is too short.',
            PWD_INVALID: 'Password is invalid.',
            SID_INVALID: 'Your student ID is invalid.',
            UNAPPROVED: 'Your committee status is still not yet approved, contact administrator.',
            UNAUTHORIZED: 'You don\'t have access rights for this function.'
        },
        ERR_INDEX_PARSE: 'Fatal error then parse project index: ',
        INDEX: {
            RES_PARSE_ERR: 'Response parse error.'
        },
        INVALID_PERM: 'You don\'t have permission for this action.',
        PROJ: {
            APPROVE: {
                FAIL: 'Project approval failed, due to internal server error.',
                INVALID: 'Data scheme to be used for approve.',
                SUCCESS: 'Successfully approved the project.'
            },
            ADD: {
                ERR: 'Project can not be created, due to internal server error.',
                EXIST: 'Project is already exists!',
                INVALID: 'Invalid project submission.',
                SUCCESS: 'Project has been created'
            },
            COMMENT:{
                FAIL: 'Failed to add a new comment to project.',
                INVALID: 'Data field is invalid.',
                SUCCESS: 'Comment was successfully added'
            },
            DISAPPROVE: {
                FAIL: 'Project disapproval failed, due to internal server error.',
                INVALID: 'Data scheme to be used for disapprove.',
                SUCCESS: 'Successfully disapproved the project.'
            },
            EDIT:{
                FAIL: 'Failed to edit project.',
                INVALID: 'Data scheme is invalid.',
                SUCCESS: 'Edit project successfully.'
            },
            NOT_EXIST: 'This project does not exist!',
            TITLE: 'Projects',
            SUBMIT:{
                FAIL: 'Upload project failed, due to internal server error.',
                INVALID: 'Data type received is invalid.',
                SUCCESS: 'Successfully uploaded document.'
            }
        }
    }
}
module.exports = constant