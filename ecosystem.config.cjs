module.exports = {
    apps: [
        {
            name: 'enderbot-app',
            script: 'pnpm', 
            args: 'run start:prod', 
            interpreter: 'node', 
            watch: false, 
            env: {
                NODE_ENV: 'production',

            },
            autorestart: true,
        },
    ],
};