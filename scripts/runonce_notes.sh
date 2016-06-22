#!/bin/bash

#
# notes setup
#
runonce_notes() {

    notify title "NOTES: Initialize container settings ..."

    # Fixing working directory permissions
    lcs-rt --fix-perm notes

    # Determine new install or restoring
    if [[ ${LCS_NEW_INSTALL} == true ]]; then
      # initial envs from user inputs and defaults
      lcs-rt --envs notes && source ${ENVS_FILE}

      # custom code after envs initialized
    else
      # custom code when restore
      notify success "NOTES restored."
    fi

    # Persist directories and files
    lcs-rt --persistence notes

    notify title "NOTES: Initialization completed."
}
