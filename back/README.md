# Backend
## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time
applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [pnpm](https://pnpm.io/) installed.
2. Install your dependencies

    ```shell
    cd back/
    pnpm i
    ```

3. Start your app with hot reload

    ```shell
    pnpm dev
    ```

## Testing

Simply run `pnpm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ pnpm install -g @feathersjs/cli@4.8.0          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).


## RPC
### Registering RPC methods
Define a public async method inside RPCHandler class. Please note that first letter must be uppercase.
```typescript
export class RPCHandler {
    public async MyMethod(data: RPC['params']) {
        return {message: `Hello ${data.name}`};
    }
}
```

Done! You can now call your RPC method from frontend.
```typescript
const {result, error} = await useService('rpc').create({
    method: 'MyMethod',
    params: {name: 'world!'}
}).exec();
if (result) {
    console.log(result.message); // Hello world!
} else {
    console.log(error.message); // Error message
}
```

## Migrations
Run migrations
```shell
pnpm migrate
```

## Scripts
Create superuser
```shell
pnpm createsu
```

Run eslint
```shell
pnpm lint
```

Run eslint & fix
```shell
pnpm lint:fix
```

Populate database with fake data
```shell
pnpm populate
```

## Deployment
Clear container logs
```shell
truncate -s 0 /var/lib/docker/containers/**/*-json.log
```
## TaskPlugin

**TaskPlugin** is a tool that lets you register tasks that need to be repeated. Your code will be repeated at the frequency you specify.


### Connect the plugin to the project (optional)
>Note: If the project was generated through scaffollding, TaskPlugin is automatically integrated.


Connection and configuring Task Plugin occurs in `src/app.ts` by importing the `Task Plugin` and applying it with `app.configure()`
```typescript
import tasksPlugin from './plugins/tasksPlugin';

app.configure(tasksPlugin('tasks'));
```

### Task registration

To register a new task in `src/tasks` create a file. The `TaskModule` interface is used to define tasks. Each task should implement this interface:

```typescript
export interface TaskModule {
    every: number // tasks execution interval (in seconds)
    run: (app: Application) => void
}
```

For example, this code prints the  date in the console
```typescript
export default TaskModule {
    every: 5;
    async run: (app: Application) {
        const date =  new Date();
        console.log(date.toUTCString())
    }
}
```
Result: code runs every 5 seconds and prints a date

<img src="https://github.com/apollo-studios/docs/blob/main/TaskPlugin.png" alt='see' style='max-width: 100%;'>
