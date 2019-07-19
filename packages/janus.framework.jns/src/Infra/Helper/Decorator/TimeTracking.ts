import {performance} from 'perf_hooks';

export function TimeTracking() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){

        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args: any[]){
            const start = performance.now();
            const executedMethod = await originalMethod.apply(this, args)
            const finish = performance.now();
            console.log(`[${new Date()} - ${propertyKey}] - Executed in ${finish - start} ms`)
            return executedMethod;
        }

        return descriptor;
    }
}