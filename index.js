const { Client, LocalAuth, Buttons, List } = require('whatsapp-web.js');

const client = new Client();
const qrcode = require('qrcode-terminal');

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

client.on("ready", async () => {
    client.pupPage.addScriptTag({ path: require.resolve("@wppconnect/wa-js") });
    await client.pupPage.waitForFunction(() => window.WPP?.isReady);

    const isAuthenticated = await client.pupPage.evaluate(() => WPP.conn.isAuthenticated());
    if (isAuthenticated) {
        //sending list message
        let optionsListMessage = {
            buttonText: "Click Me!",
            description: "Hello it's list message",
            title: "Hello user",
            footer: "Click and choose one",
            sections: [
                {
                    title: "Section 1",
                    rows: [
                        {
                            rowId: "rowid1",
                            title: "Row 1",
                            description: "Hello it's description 1"
                        },
                        {
                            rowId: "rowid2",
                            title: "Row 2",
                            description: "Hello it's description 2"
                        }
                    ]
                }
            ]
        };
        const sendList = await client.pupPage.evaluate(
            (to, options) => WPP.chat.sendListMessage(to, options),
            "5511993534772@c.us",
            optionsListMessage
        );

        //sending button message (url and call buttons is supported 👍)
        let optionsButtonMessage = {
            useTemplateButtons: true,
            buttons: [
                {
                    url: "https://google.com/",
                    text: "Google Site"
                },
                {
                    phoneNumber: "+5511993534772",
                    text: "Call me"
                },
                {
                    id: "your custom id 1",
                    text: "Some text"
                },
                {
                    id: "another id 2",
                    text: "Another text"
                }
            ],
            title: "Title text",
            footer: "Footer text"
        };
        const sendButton = await client.pupPage.evaluate(
            (to, options) => WPP.chat.sendTextMessage(to, "Hello it's button message", options),
            "5511993534772@c.us",
            optionsButtonMessage
        );
    }
});

client.on('message', async msg => {
    console.log("MESSAGE", msg)
    if (msg.body == '!ping') {
        const button = new Buttons('Button body',[{body: 'Test', id: 'test-1'}, {body: "Test 2"}],'title','footer');
        // const productsList = new List(
        //     "Here's our list of products at 50% off",
        //     "View all products",
        //     [
        //       {
        //         title: "Products list",
        //         rows: [
        //           { id: "apple", title: "Apple" },
        //           { id: "mango", title: "Mango" },
        //           { id: "banana", title: "Banana" },
        //         ],
        //       },
        //     ],
        //     "Please select a product"
        //   );
        client.sendMessage(msg.from, "ALOU");
        client.sendMessage(msg.from, button);
        // client.sendMessage(msg.from, productsList);
    }
    // if(msg.hasMedia) {
    //     const media = await msg.downloadMedia();
    //     // do something with the media data here
    //     console.log("MEDIA", media)
    // }
});

client.initialize();