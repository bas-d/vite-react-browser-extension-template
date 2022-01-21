class Logger {
    public error(error: unknown) {
        console.error(error);
    }
}

const logger = new Logger();
export default logger;
