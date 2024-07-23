export const handleFormHook = (target, set, ifFunc=false) => {
    const { name, value } = target;
    console.log(value);
    console.log(name);
    console.log(`ifFunc: ${ifFunc}`);
    if (ifFunc) {
        set(value, name)
    }else {
        set( old => {
            return {
                ...old,
                [name]: value
            }
        })
    }
};