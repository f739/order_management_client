export const handleFormHook = (target, set, ifFunc=false) => {
    const { name, value } = target;
    console.log(value);
    console.log(name);
    if (ifFunc) {
        set(value)
    }else {
        set( old => {
            return {
                ...old,
                [name]: value
            }
        })
    }
};