export function Throttle(milliseconds = 1000) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){

        const method = descriptor.value;

        let timer = 0;        
        descriptor.value = function(...args: any[]){
            clearInterval(timer);
            setTimeout(() => {
                const executedMethod = method.apply(this, args)
            }, milliseconds);
        }

        return descriptor;
    }
}