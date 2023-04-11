# This project is in its extremly early phases and is not meant for production 

## Known "issue" - calmbot crashes after build 
> **Currently after building calmbot, it will not function** due to their being a lack of a "tasks directory" 
<br>
> Upon initilization calmbot attempts to read files from the tasks directory in order to register them and allow them to be ran through the cron job 
<br>
> However due to only the infastructure supporting the tasks system being commited thus far and no tasks actually being created yet, there is a lack of a tasks directory which calmbot does not know how to handle 
<br>
> The best work ar ound for this issue at the moment would be to comment out the part in `./apps/calmbot/src/index.ts` that starts the tasks - `startTasks(...)`
