export const OptionType = {
    1: "SubCommand", // -> Subcommand
    2: "SubCommandGroup", // -> SubcommandGroup
    3: "Texto", // -> String
    4: "Numero Entero", // -> Integer
    5: "True or False", // -> Booleano
    6: "Usuario", // -> User
    7: "Canal", // -> Channel
    8: "Rol", // -> Role
    9: "Mencionable", // -> Mentionable
    10: "Numero", // -> Number
    11: "Archivo" // -> Attachment
}


export const FormatOptionType = (type: number) =>  { return OptionType[type] }