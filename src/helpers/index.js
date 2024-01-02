
/**
 * User has permission
 * @param {Array | String} permissionLabel 
 * @param {Boolean} hasSome 
 * @returns 
 */
export const hasPermission = (permissionLabel, hasSome = false) => {
    const userPermissions = localStorage.getItem("najdPermissions");
    if(!userPermissions) return false;
  
    if(typeof permissionLabel == 'object' && permissionLabel.length) {
      if(hasSome) {
        return permissionLabel.some(permission => userPermissions?.includes(permission))
      }
  
      return permissionLabel.every(permission => userPermissions?.includes(permission))
    }
  
    return userPermissions?.includes(permissionLabel);
  }

  /**
   * user has roles
   * @param {Array | String} rolesKeys 
   * @returns 
   */
  export const hasRole = (rolesKeys = []) => {
    if(!localStorage.getItem("najdUser")) return false;

    const user = JSON.parse(localStorage.getItem("najdUser"));
    const roles = user.roles || [];

    if(typeof rolesKeys == "string") {
      return roles.some((role) => role == rolesKeys);
    }

    let hasOneRole = 0;
    rolesKeys.forEach((roleKey) => {
      if(roles.some((role) => role == roleKey)) {
        hasOneRole++;
      }
    })

    return hasOneRole > 0;
  }