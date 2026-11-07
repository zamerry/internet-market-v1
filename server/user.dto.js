class UserDto {
    email
    id
    // activation_link
    constructor(model) {
        this.email = model.email
        this.id = model.id_profile
        // this.activation_link = model.activation_link
    }
}

export default UserDto