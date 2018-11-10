export default {
    input: './dist/esm3/public_api.js',
    output: [
        {
            file: './dist/fesm3/sheetbase-tamotsux-server.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: './dist/bundles/sheetbase-tamotsux-server.umd.js',
            format: 'umd',
            sourcemap: true,
            name: 'Tamotsux'
        }
    ]
};
