export type EquipoMiembro = { name: string; email: string; phone: string };
export type EquipoNCC = { name: string; members: EquipoMiembro[] };

export const EQUIPOS_NCC_2026: EquipoNCC[] = [
  {
    name: "Nexus Consulting",
    members: [
      { name: "Luna Brausin Correa", email: "lbrausin.correa@gmail.com", phone: "3002136369" },
      { name: "Simon Eduardo Nieto Diaz", email: "simonnietodiaz2008@gmail.com", phone: "3167869883" },
      { name: "Luisa María Arias Hernández", email: "luisaarhe@unisabana.edu.co", phone: "3172230107" },
      { name: "María Teresa Pavajeau Ávila", email: "mtpavajeau@gmail.com", phone: "3503419143" },
    ],
  },
  {
    name: "ExcelEntes",
    members: [
      { name: "Ana Sofía Merchán", email: "a.merchanh@uniandes.edu.co", phone: "3154968068" },
      { name: "Susana Franco Cardozo", email: "sfrancocardozo@gmail.com", phone: "3005281280" },
      { name: "Mateo Rincón", email: "m.rinconz@uniandes.edu.co", phone: "3046321835" },
      { name: "Jose Melgarejo", email: "josemelro@unisabana.edu.co", phone: "3103937321" },
    ],
  },
  {
    name: "SSAF: Strategic Solutions & Advisory Firm",
    members: [
      { name: "Nelson Felipe Celis Díaz", email: "nf.celis@uniandes.edu.co", phone: "3202892762" },
      { name: "Sofia Morato Leyton", email: "s.moratol@uniandes.edu.co", phone: "3204811024" },
      { name: "Santiago Seade Rachadell", email: "s.seade@uniandes.edu.co", phone: "3188097809" },
      { name: "Andrea Vargas Torres", email: "andreavargas32005@gmail.com", phone: "3226101753" },
    ],
  },
  {
    name: "Data solvers consulting",
    members: [
      { name: "María Fernanda Muñoz Alfonso", email: "mf.munoza1@uniandes.edu.co", phone: "3112338094" },
      { name: "Franco Saavedra Camargo", email: "F.saavedra1@uniandes.edu.co", phone: "3125334583" },
      { name: "Lucas Valbuena Leon", email: "L.valbuena1@uniandes.edu.co", phone: "3124914887" },
      { name: "Juan Goyeneche Sáenz", email: "j.goyeneches@uniandes.edu.co", phone: "3005090490" },
    ],
  },
  {
    name: "Cordillera Partners",
    members: [
      { name: "David Cabrera Trujillo", email: "d.cabrerat2@uniandes.edu.co", phone: "3116170626" },
      { name: "Carlos Rodrigo Abondano", email: "c.abondano@uniandes.edu.co", phone: "3158237188" },
      { name: "Vanessa Alexandra Parra Paredes", email: "va.parrap1@uniandes.edu.co", phone: "3213146327" },
      { name: "Angella Valeria Giambruno tarquino", email: "a.giambruno@uniandes.edu.co", phone: "3126730031" },
    ],
  },
  {
    name: "Los Big 4",
    members: [
      { name: "Mateo Gómez", email: "m.gomezh2345@uniandes.edu.co", phone: "3134038474" },
      { name: "María José Sandoval", email: "mj.sandovalg1@uniandes.edu.co", phone: "3209979387" },
      { name: "Carlos Andrés Gómez", email: "ca.gomezb1234@uniandes.edu.co", phone: "3126736853" },
      { name: "Jung Hann Chu", email: "j.chu@uniandes.edu.co", phone: "3203297986" },
    ],
  },
  {
    name: "A3E",
    members: [
      { name: "Alejandro Jacob Florez Mayorga", email: "aj.florezm1@uniandes.edu.co", phone: "3013459840" },
      { name: "Andres Romero Reina", email: "a.romeror@uniandes.edu.co", phone: "3219094887" },
      { name: "Ellen Sofia Arevalo Ramos", email: "esofiar25@gmail.com", phone: "3197402738" },
      { name: "Ana Maria Rodriguez Caro", email: "a.rodriguezc23456@uniandes.edu.co", phone: "3173395316" },
    ],
  },
  {
    name: "GAMMA Consulting",
    members: [
      { name: "Manuela García", email: "m.garciav23@uniandes.edu.co", phone: "3164660912" },
      { name: "Ana María Cuesta", email: "a.cuestao@uniandes.edu.co", phone: "3163166289" },
      { name: "Gabriela Sandoval", email: "g.sandovalm@uniandes.edu.co", phone: "3217095315" },
      { name: "Alejandro Sánchez", email: "a.sanchezc234@uniandes.edu.co", phone: "3003448040" },
    ],
  },
  {
    name: "Volt",
    members: [
      { name: "Daniela Peñuela Bernal", email: "dp133766@gmail.com", phone: "3104348306" },
      { name: "Sofia Vega Anillo", email: "s.vega11@uniandes.edu.co", phone: "3103026967" },
      { name: "José Manuel Chanchay Herrera", email: "j.chanchaytrabajo@gmail.com", phone: "3007078566" },
      { name: "Pablo Alejandro Valencia Baron", email: "pablobaron32@gmail.com", phone: "3507699271" },
    ],
  },
  {
    name: "IMS Project",
    members: [
      { name: "Manuela Siado Jaramillo", email: "m.siado@uniandes.edu.co", phone: "3152966451" },
      { name: "Sofía Hernández Bustamante", email: "sofiaherbus@gmail.com", phone: "3053795632" },
      { name: "Isabella Muñoz Ramírez", email: "isabellamunozramirez05@gmail.com", phone: "3102104325" },
      { name: "Sebastian Martinez Acevedo", email: "sebastian.martinez0804@gmail.com", phone: "3173124630" },
    ],
  },
  {
    name: "Peak",
    members: [
      { name: "Juan Pablo Ramirez", email: "j.ramirez35@uniandes.edu.co", phone: "3172253412" },
      { name: "Juan Sebastián Sterling", email: "j.sterlingm@uniandes.edu.co", phone: "3188706338" },
      { name: "Sebastián Rodríguez", email: "s.rodrigueza234567@uniandes.edu.co", phone: "3053604041" },
      { name: "Juanita Cuervo", email: "j.cuervod@uniandes.edu.co", phone: "3224853767" },
    ],
  },
  {
    name: "M3T Consulting",
    members: [
      { name: "Nicolas Mendez", email: "n.mendeza@uniandes.edu.co", phone: "3154176634" },
      { name: "Tomas Martinez", email: "t.martinezb@uniandes.edu.co", phone: "3108837157" },
      { name: "Nicolas Moreno", email: "n.morenom2@uniandes.edu.co", phone: "3103149185" },
      { name: "Simon toro", email: "s.torop2@uniandes.edu.co", phone: "3002257634" },
    ],
  },
  {
    name: "Monis Hunters",
    members: [
      { name: "Juan Felipe Pulido Torres", email: "juanpulto@unisabana.edu.co", phone: "3183072232" },
      { name: "Juliana Gaviria Arroyave", email: "julianagaar@unisabana.edu.co", phone: "3162513615" },
      { name: "Santiago Rodriguez Vargas", email: "santiagorova@unisabana.edu.co", phone: "3105325308" },
      { name: "Samuel Iriarte Becerra", email: "samuelirbe@unisabana.edu.co", phone: "3023479321" },
    ],
  },
  {
    name: "Impacta",
    members: [
      { name: "Laura Isabella Casas Sierra", email: "lauracasi@unisabana.edu.co", phone: "3167308850" },
      { name: "Jose Daniel Aponte Pardo", email: "joseappa@unisabana.edu.co", phone: "3194176241" },
      { name: "Maria Valeria Laverde Aponte", email: "marialaap@unisabana.edu.co", phone: "3014527497" },
      { name: "Juan David Rico Espinosa", email: "juanrices@unisabana.edu.co", phone: "3054160576" },
    ],
  },
  {
    name: "three makers",
    members: [
      { name: "carla isabella sánchez rodríguez", email: "prv.carla11@gmail.com", phone: "3152112023" },
      { name: "diego alejandro medina llanos", email: "prv.carla11@gmail.com", phone: "3152112023" },
      { name: "pedro josé molina", email: "prv.carla11@gmail.com", phone: "3152112023" },
      { name: "Maria Jose Albarracin", email: "m.albarracinb@uniandes.edu.co", phone: "3053263809" },
    ],
  },
  {
    name: "STRATEX",
    members: [
      { name: "Julián Esteban Mora Argote", email: "julianmoar@unisabana.edu.co", phone: "3238052018" },
      { name: "Zamir Esteban Torijano Saavedra", email: "zamirtosa@unisabana.edu.co", phone: "3115788013" },
      { name: "Valeria Calderon Barreto", email: "valeriacaba@unisabana.edu.co", phone: "3017574009" },
      { name: "Daniela Rivera Castillo", email: "danielarivecas@unisabana.edu.co", phone: "3194578496" },
    ],
  },
  {
    name: "Convergence",
    members: [
      { name: "Eduardo Alexander Gutiérrez Pérez", email: "Eduardogutierrezp@hotmail.com", phone: "3502311202" },
      { name: "Laura Alejandra Díaz Sastoque", email: "laaldisa22@gmail.com", phone: "3228455727" },
      { name: "Santiago Mayorga Barriga", email: "santiagomayorgab9@gmail.com", phone: "3113163178" },
      { name: "Alejandra Millan Hinestrosa", email: "alejamillan04@gmail.com", phone: "3016076358" },
    ],
  },
  {
    name: "Combo cadillo",
    members: [
      { name: "Hower", email: "h.rozo@uniandes.edu.co", phone: "3004193310" },
      { name: "Martina Riaño Vergara", email: "M.rianov@uniandes.edu.co", phone: "3147029080" },
      { name: "Valerie Ortiz Román", email: "v.ortizr2@uniandes.edu.co", phone: "3102117054" },
      { name: "Laura Natalia Escamilla Chaparro", email: "l.escamillac@uniandes.edu.co", phone: "3003260483" },
    ],
  },
  {
    name: "D-Krea",
    members: [
      { name: "Dana Valentina Benavides Cruz", email: "danabecr@unisabana.edu.co", phone: "3223754611" },
      { name: "Karol Juliana Hoyos Guerrero", email: "karolhogu@unisabana.edu.co", phone: "3144513972" },
      { name: "Daniela Gerardino Huertas", email: "danielagehu@unisabana.edu.co", phone: "573025284452" },
      { name: "Daniela Valentina López Ortíz", email: "danielaloot@unisabana.edu.co", phone: "3053259031" },
    ],
  },
  {
    name: "4ward Consulting",
    members: [
      { name: "Juanita Valentina Cortés Vargas", email: "jv.cortesv1@uniandes.edu.co", phone: "3213173181" },
      { name: "Pablo Novoa Cárdenas", email: "p.novoa@uniandes.edu.co", phone: "3003425129" },
      { name: "Ariadna Isabella Arcila Giraldo", email: "a.arcilag@uniandes.edu.co", phone: "3173930853" },
      { name: "Andres Jaramillo Erazo", email: "a.jaramilloe@uniandes.edu.co", phone: "3145573478" },
    ],
  },
  {
    name: "FM Consulting",
    members: [
      { name: "Felipe Botero Godoy", email: "boterofelipe@javeriana.edu.co", phone: "3153806670" },
      { name: "Mariana Moreno Sabogal", email: "momariana@javeriana.edu.co", phone: "3222111353" },
      { name: "Luis Felipe Cerón Salazar", email: "Lf.ceron@javeriana.edu.co", phone: "3054160565" },
      { name: "Marian Silvana Sierra Latorre", email: "Marian.sierra@javeriana.edu.co", phone: "3016079960" },
    ],
  },
  {
    name: "SODANAMA",
    members: [
      { name: "NELSON DAVID RIOS MOLINA", email: "riosdavid828@gmail.com", phone: "3004170706" },
      { name: "NATALIA VALENCIA", email: "valenciacnatalia@javeriana.edu.co", phone: "3124454214" },
      { name: "Diana Sofia Vargas Montoya", email: "Vargasm.d@javeriana.edu.co", phone: "3213026020" },
      { name: "Mariana Duque Rodriguez", email: "laura.duquer@javeriana.edu.co", phone: "3213264442" },
    ],
  },
  {
    name: "V4 Consulting",
    members: [
      { name: "Valeria Buitrago Medina", email: "valeriabumed@gmail.com", phone: "3217530593" },
      { name: "Maria Jose Saenz Carrizosa", email: "mariajosesaenzcarrizosa@gmail.com", phone: "3166760921" },
      { name: "Gabriela Benedetti Leal", email: "gbenedettileal@gmail.com", phone: "3168274810" },
      { name: "Alejandra Franco Rivero", email: "2005afranco@gmail.com", phone: "3155527172" },
    ],
  },
  {
    name: "Nexus Strategy",
    members: [
      { name: "Federico Barreto Barrero", email: "f.barreto1@uniandes.edu.co", phone: "3203033295" },
      { name: "Nicolás Carrera More", email: "n.carrera@uniandes.edu.co", phone: "3167486963" },
      { name: "Nicholas Bautista Martínez", email: "n.bautistam2@uniandes.edu.co", phone: "3017629483" },
      { name: "Nicolas Suárez Burgos", email: "n.suarez@uniandes.edu.co", phone: "3228960730" },
    ],
  },
  {
    name: "Externomics",
    members: [
      { name: "Ana Sofía Rodríguez Fonseca", email: "anarodriguezfon@gmail.com", phone: "3227789368" },
      { name: "Isabella Vesga Luna", email: "Bellavesga@gmail.com", phone: "3508479860" },
      { name: "Juan Miguel Riveros Galvis", email: "Jumirigal2415@gmail.com", phone: "3115389397" },
      { name: "Thomas David Escobar Roa", email: "thomasesc2442@gmail.com", phone: "3157660177" },
    ],
  },
  {
    name: "Los Consultores",
    members: [
      { name: "Daniel Benavides", email: "d.benavidess@uniandes.edu.co", phone: "3202061776" },
      { name: "María José Serna", email: "m.sernar@uniandes.edu.co", phone: "3004619087" },
      { name: "Orlando Suárez", email: "o.suarezs@uniandes.edu.co", phone: "3057722110" },
      { name: "Andrés Felipe Herrera", email: "a.herrerat@uniandes.edu.co", phone: "3163589745" },
    ],
  },
  {
    name: "Northstar",
    members: [
      { name: "María Paula Marín", email: "mp.marino1@uniandes.edu.co", phone: "3222038313" },
      { name: "Camilo Garavito Barrios", email: "ca.garavito@uniandes.edu.co", phone: "3114470505" },
      { name: "Maria Alejandra Sanabria Velandia", email: "m.sanabriav@uniandes.edu.co", phone: "3219771750" },
      { name: "Nicolás Manrique Ramirez", email: "n.manriquer@uniandes.edu.co", phone: "3505819072" },
    ],
  },
  {
    name: "Total Consulting",
    members: [
      { name: "María Corina Rengifo Romero", email: "mariarenro@unisabana.edu.co", phone: "3045993550" },
      { name: "Simón Cuello Iriarte", email: "simoncuir@unisabana.edu.co", phone: "3112342143" },
      { name: "Andrés Mauricio Rodríguez Ruiz", email: "andresroru@unisabana.edu.co", phone: "310308743" },
      { name: "María José Barraza Martínez", email: "mariabarramart@unisabana.edu.co", phone: "3023705574" },
    ],
  },
  {
    name: "ALVIN Y LAS ARDILLAS",
    members: [
      { name: "CARLOS DAVID SUAREZ MUÑOZ", email: "CARLOS.SUAREZ.KD26@GMAIL.COM", phone: "3143881919" },
      { name: "María Camila García", email: "mcgarciapolanco@gmail.com", phone: "3155543469" },
      { name: "Luisa Fernanda Fernández", email: "luifer022707@gmail.com", phone: "3104541441" },
      { name: "Mariana Gómez Sañudo", email: "1016833945@u.icesi.edu.co", phone: "3135428402" },
    ],
  },
  {
    name: "Equipo Omega",
    members: [
      { name: "Dennys Alejandro Lozano Mora", email: "da.lozanom1@uniandes.edu.co", phone: "3192486483" },
      { name: "Nicolas Andrés Bolaños Fernandez", email: "n.bolanosf@uniandes.edu.co", phone: "3135718293" },
      { name: "Christian Alberto Bravo Montes", email: "ca.bravom1@uniandes.edu.co", phone: "3135428160" },
      { name: "Nicolás Fajardo Aguirre", email: "n.fajardoa@uniandes.edu.co", phone: "3194357152" },
    ],
  },
  {
    name: "THECNO",
    members: [
      { name: "Diana Sofia Galvan Valbuena", email: "dianasofiagalvan600@gmail.com", phone: "3224379164" },
      { name: "Dulce Mariana Torres Quiñones", email: "dulcemtorresq28@gmail.com", phone: "3224455952" },
      { name: "Andrea Johana Florez Bautista", email: "ajohanaflorez@gmail.com", phone: "3224379164" },
      { name: "Eliana Higuera Guerrero", email: "dianasofiagalvan600@gmail.com", phone: "3103155231" },
    ],
  },
  {
    name: "No Brainers",
    members: [
      { name: "Manuel Felipe Guzmán Osorio", email: "mf.guzmano12@uniandes.edu.co", phone: "3015304726" },
      { name: "Mateo Jaimes Rincon", email: "m.jaimesr2@uniandes.edu.co", phone: "3135115442" },
      { name: "David Eduardo Cantor Baez", email: "d.cantorb@uniandes.edu.co", phone: "3143580654" },
      { name: "Gabriela Campos Machado", email: "g.camposm@uniandes.edu.co", phone: "3142742513" },
    ],
  },
  {
    name: "Bull Partners",
    members: [
      { name: "Juan Diego Moreno Miranda", email: "j.morenom23@uniandes.edu.co", phone: "3028526348" },
      { name: "Salomon Gonzalez Lozada", email: "sgonzalezla3@gmail.com", phone: "3242120943" },
      { name: "Miguelangel Villalba Moreno", email: "miguelbeck0714@gmail.com", phone: "3243282386" },
      { name: "Efrain Santiago Tellez Becaria", email: "e.tellezb@uniandes.edu.co", phone: "3143832266" },
    ],
  },
  {
    name: "Kairós",
    members: [
      { name: "Rodrigo Paz Londoño", email: "r.pazl@uniandes.edu.co", phone: "3225398387" },
      { name: "Sara Valentina Rozo Oviedo", email: "s.rozoo@uniandes.edu.co", phone: "3057881632" },
      { name: "Rosita Sofia Quintero Llorente", email: "r.quinterol@uniandes.edu.co", phone: "3132403879" },
      { name: "Pablo Castellanos", email: "p.castellanosr@uniandes.edu.co", phone: "3175666254" },
    ],
  },
  {
    name: "Los Glegles",
    members: [
      { name: "Samuel Rodríguez Peña", email: "s.rodriguezp23@uniandes.edu.co", phone: "3225313987" },
      { name: "Tomas Aponte", email: "t.aponte@uniandes.edu.co", phone: "3123248176" },
      { name: "Jairo David Acosta", email: "jd.acostav12@uniandes.edu.co", phone: "3216158393" },
      { name: "Maria Juliana Romero Muñoz", email: "mariarommu@unisabana.edu.co", phone: "3227280991" },
    ],
  },
  {
    name: "Grupo PRISMA",
    members: [
      { name: "David Felipe Rojas Gaitan", email: "davidfrojasg@javeriana.edu.co", phone: "3219570968" },
      { name: "Santiago Bernal Lugo", email: "Bernallsantiago@javeriana.edu.co", phone: "3115943058" },
      { name: "Carol Sofía Cárdenas Osorio", email: "cardenaso.csofia@javeriana.edu.co", phone: "3157641684" },
      { name: "Simón Romero Gómez", email: "simonromero@javeriana.edu.co", phone: "3192460543" },
    ],
  },
  {
    name: "Nova Pitch",
    members: [
      { name: "Alejandra Duque Valencia", email: "a.duquev@uniandes.edu.co", phone: "3143584006" },
      { name: "Isabel Duque Londoño", email: "i.duquel@uniandes.edu.co", phone: "3113278404" },
      { name: "Daniela Gonzalez Ovalle", email: "d.gonzalezo2@uniandes.edu.co", phone: "3206684921" },
      { name: "Sofia Arias Zuluaga", email: "s.ariasz2@uniandes.edu.co", phone: "3153937411" },
    ],
  },
  {
    name: "Caso Cerrado",
    members: [
      { name: "Laura Sofia Ayala Betancourt", email: "ls.ayala@uniandes.edu.co", phone: "3223329547" },
      { name: "Carlos Alfredo Ayala Betancourt", email: "ca.ayala20@uniandes.edu.co", phone: "3235893804" },
      { name: "Sofía Acosta Muriel", email: "sofiacostamuriel@outlook.com", phone: "3153692011" },
      { name: "Alejandra Villarraga Rincon", email: "avillarraga2602@gmail.com", phone: "3142331731" },
    ],
  },
  {
    name: "Nexus",
    members: [
      { name: "Julian Avendaño López", email: "jucaaveloo@gmail.com", phone: "3007664180" },
      { name: "Santiago Bravo Pinilla", email: "s.bravo1@uniandes.edu.co", phone: "3150489658" },
      { name: "Jorge Luis Reyes Pasquale", email: "pasqualejorge008@gmail.com", phone: "3164961363" },
      { name: "Nicolás Pinilla Suárez", email: "npinilla208@gmail.com", phone: "3208718234" },
    ],
  },
  {
    name: "Business Dream",
    members: [
      { name: "Nahyelí Morón Hernández", email: "nahyelimohe@unisabana.edu.co", phone: "3138904672" },
      { name: "Sara Sofía Arevalo Rodríguez", email: "saraarro@unisabana.edu.co", phone: "3017877781" },
      { name: "Ana Sofía Santander Prieto", email: "anasapr@unisabana.edu.co", phone: "3114830214" },
      { name: "Laura Valentina Medina Acosta", email: "laurameac@unisabana.edu.co", phone: "3167359414" },
    ],
  },
  {
    name: "Foursight Consulting Group",
    members: [
      { name: "Isabella Santamaria Caballero", email: "isantamariac@javeriana.edu.co", phone: "3053617130" },
      { name: "Gabriela Bermudez Caicedo", email: "bermudezga@javeriana.edu.co", phone: "3044007853" },
      { name: "Isabela Garavito Ortiz", email: "garavitoo.i@javeriana.edu.co", phone: "3172815526" },
      { name: "Juliana Martines Marentes", email: "martinezm.j@javeriana.edu.co", phone: "3157896552" },
    ],
  },
  {
    name: "Phronesis",
    members: [
      { name: "Mariana Hernández", email: "hernandez-mariana@javeriana.edu.co", phone: "3172694703" },
      { name: "Kendy Vanessa Fajardo", email: "fajardovkv@javeriana.edu.co", phone: "3156078937" },
      { name: "Diego Alexandre Velez", email: "da.veleza@javeriana.edu.co", phone: "3115854669" },
      { name: "Ana María Beltrán", email: "anam_beltran@javeriana.edu.co", phone: "3504288666" },
      { name: "Evasandryth Molina Arias", email: "molinaarias25@gmail.com", phone: "3153349085" },
    ],
  },
  {
    name: "MonteCarlo",
    members: [
      { name: "Juan Eduardo Ballesteros Pinzon", email: "je.ballesteros@uniandes.edu.co", phone: "3142837040" },
      { name: "Santiago Cordero Martinez", email: "s.cordero@uniandes.edu.co", phone: "3208514589" },
      { name: "Tomas Acosta Romero", email: "tomasacostar22@gmail.com", phone: "3167903839" },
      { name: "Maria Paula Peña Molina", email: "mariapenam9@gmail.com", phone: "3213016007" },
    ],
  },
  {
    name: "Keystone",
    members: [
      { name: "Camila Arias", email: "mc.ariasa1@uniandes.edu.co", phone: "3004751360" },
      { name: "Gonzalo Grimaldos", email: "g.grimaldos@uniandes.edu.co", phone: "3123427456" },
      { name: "Manuela Romero", email: "m.romeror2@uniandes.edu.co", phone: "3134319167" },
      { name: "Angelo di Marco", email: "a.di@uniandes.edu.co", phone: "3202484130" },
    ],
  },
  {
    name: "Angel ICA Consultants",
    members: [
      { name: "Julián Andrés Forero Salgado", email: "jaforeros@javeriana.edu.co", phone: "3026622746" },
      { name: "Oscar Santiago Narvaez Muñoz", email: "o.santiago.narvaez.m@gmail.com", phone: "3104825830" },
      { name: "Nicolas Lopez Jimenez", email: "nicolopez0526@gmail.com", phone: "3117706323" },
      { name: "Diego Andres Montañes Capacho", email: "diegoesca1306@gmail.com", phone: "3115798649" },
    ],
  },
  {
    name: "Consultoti",
    members: [
      { name: "EMILIO", email: "e.quinterol2@uniandes.edu.co", phone: "3166241240" },
      { name: "Juliana Salgar", email: "j.salgar@uniandes.edu.co", phone: "3162678385" },
      { name: "Sofia Angulo", email: "s.angulod@uniandes.edu.co", phone: "3045567033" },
      { name: "Martin Amaya", email: "m.amaya112@uniandes.edu.co", phone: "3166185835" },
    ],
  },
  {
    name: "Los sinérgicos",
    members: [
      { name: "Samuel Gualdrón Herrera", email: "samuelgualdronh@gmail.com", phone: "3014535755" },
      { name: "Felipe Naranjo Vallejo", email: "felipenaranjovallejo@gmail.com", phone: "3005199462" },
      { name: "Isabel Juliao Manotas", email: "isajuliaom@gmail.com", phone: "3008056207" },
      { name: "George David Muñoz Rodriguez", email: "dn161661@gmail.com", phone: "3117705838" },
    ],
  },
  {
    name: "The Case Lab",
    members: [
      { name: "Camila García Olarte", email: "c.garciao2@uniandes.edu.co", phone: "3184158828" },
      { name: "Valentina Bohorquez", email: "Vbohorqueznino@gmail.com", phone: "3115706314" },
      { name: "Sofía Villamizar", email: "s.villamizarb@uniandes.edu.co", phone: "3164547394" },
      { name: "Maria Jose Altamar Lozano", email: "m.altamar@uniandes.edu.co", phone: "3124061025" },
    ],
  },
  {
    name: "JAMS Consulting",
    members: [
      { name: "Mariana Hernandez Agudelo", email: "mariana6002@javerianacali.edu.co", phone: "3116262059" },
      { name: "Simón Taylor Vásquez", email: "stvtaylorvasquez@gmail.com", phone: "3224080669" },
      { name: "Daniela Alejandra Hernandez Ortiz", email: "danielaalejandra@javerianacali.edu.co", phone: "3144065467" },
      { name: "Juan Esteban Oliveros Castillo", email: "juancastillo2007@javerianacali.edu.co", phone: "3205475668" },
    ],
  },
  {
    name: "Consulting 360",
    members: [
      { name: "Camila Uribe", email: "camilauribe1121@gmail.com", phone: "3177998874" },
      { name: "Juan Sebastian Rodriguez", email: "juan.rodriguezh@cesa.edu.co", phone: "3209475941" },
      { name: "Abie Wiznitzer", email: "abie.wiznitzer@cesa.edu.co", phone: "3202968059" },
      { name: "Isabella Suarez", email: "isabella.suarezf@cesa.edu.co", phone: "3158228108" },
    ],
  },
  {
    name: "The Estrategists",
    members: [
      { name: "Valentina Torres Cárdenas", email: "v.torresc@uniandes.edu.co", phone: "3147576454" },
      { name: "Dana Sofía García", email: "ds.garciam12@uniandes.edu.co", phone: "3238311659" },
      { name: "Natalia López", email: "n.lopezv2@uniandes.edu.co", phone: "3507055876" },
      { name: "Tere Eloisa Vanegas Perez", email: "t.vanegas@uniandes.edu.co", phone: "3046026814" },
    ],
  },
  {
    name: "NEXOR - Consulting",
    members: [
      { name: "Edgar Saul Castillo Cueva", email: "edcastillocue@uide.edu.ec", phone: "995875873" },
      { name: "Mauricio Alexander Garcia Camacho", email: "magarciacam@uide.edu.ec", phone: "981465650" },
      { name: "Andrés Gonzalo Luzuriaga Arévalo", email: "anluzuriagaar@uide.edu.ec", phone: "984066459" },
      { name: "Galo Rafael Lomas Almeida", email: "galomasal@uide.edu.ec", phone: "999594024" },
    ],
  },
  {
    name: "Code4andes",
    members: [
      { name: "José Daniel Gómez cifuentes", email: "josedani1115@gmail.com", phone: "3502488804" },
      { name: "Kristin juliana canabal pájaro", email: "kristincpajaro2@gmail.com", phone: "3114524734" },
      { name: "Samuel rojas duque", email: "s.rojasd2@uniandes.edu.co", phone: "3123809456" },
      { name: "Ricardo Alejandro Andrés suescun tapia", email: "r.suescunt@uniandes.edu.co", phone: "3104373771" },
    ],
  },
  {
    name: "Ayllu",
    members: [
      { name: "Emily Vianney Orbe Marcillo", email: "emorbema@uide.edu.ec", phone: "987673064" },
      { name: "Andrea Verónica Muñoz Jiménez", email: "anmunozji@uide.edu.ec", phone: "981394111" },
      { name: "María Paula Pazmiño Toledo", email: "mapazminoto@uide.edu.ec", phone: "995753688" },
      { name: "Josué Sebastián Cárdenas Jhayya", email: "jocardenasjh@uide.edu.ec", phone: "982929950" },
    ],
  },
  {
    name: "ETS & Co.",
    members: [
      { name: "David \"El Tino (ET)\" Ramírez", email: "d.ramirezg23@uniandes.edu.co", phone: "3213651947" },
      { name: "Esteban \"Sipilindo (S)\" Cacheo", email: "e.cacheo@uniandes.edu.co", phone: "3217869009" },
      { name: "Zhanna Angeline \"& Co.\" Uscátegui Moreno", email: "z.uscategui@uniandes.edu.co", phone: "3028669858" },
      { name: "Juan Diego \"& Co.\" Ortega Romero", email: "jd.ortega12@uniandes.edu.co", phone: "3204808054" },
    ],
  },
  {
    name: "Mêtis Consulting",
    members: [
      { name: "Andrés Felipe Amador Henao", email: "af.amador@uniandes.edu.co", phone: "3219554716" },
      { name: "Santiago Prada", email: "s.prada5@uniandes.edu.co", phone: "3028493374" },
      { name: "Daniel Galarza", email: "d.galarza1@uniandes.edu.co", phone: "3174334752" },
      { name: "Alejandro Echeverría", email: "a.echeverria1@uniandes.edu.co", phone: "3042591960" },
    ],
  },
  {
    name: "Winners",
    members: [
      { name: "Mariana Apráez", email: "m.apraez@uniandes.edu.co", phone: "3024653011" },
      { name: "Felipe Vargas", email: "Jf.vargasr1@uniandes.edu.co", phone: "3209142637" },
      { name: "Natalia Ayala", email: "n.ayalaa@uniandes.edu.co", phone: "3188932335" },
      { name: "Mariana Huertas", email: "m.huertasl@uniandes.edu.co", phone: "3125185905" },
    ],
  },
  {
    name: "Gestión Elite",
    members: [
      { name: "Domenica Saleth", email: "dsfloresg@utn.edu.ec", phone: "986161153" },
      { name: "Gisel Priscila Imbacuán Reascos", email: "gpimbacuanr@utn.edu.ec", phone: "990981316" },
      { name: "Lenin David Marcillo Fiallos", email: "ldmarcillof@utn.edu.ec", phone: "995950015" },
      { name: "Dayana Soledad Morales Simba", email: "dsmoraless@utn.edu.ec", phone: "968497460" },
    ],
  },
  {
    name: "C4 Consulting Group",
    members: [
      { name: "Jeronimo Londoño", email: "jeronimo.londono@cesa.edu.co", phone: "3167335811" },
      { name: "David Puerta Martínez CESA", email: "David.puerta@cesa.edu.co", phone: "3114548554" },
      { name: "María Juliana Dussan Perdomo", email: "juliana.dussan@cesa.edu.co", phone: "3053846037" },
      { name: "Tomas villaneda Forero", email: "Tomasvillaneda2005@gmail.com", phone: "3164326620" },
    ],
  },
  {
    name: "VENTUS",
    members: [
      { name: "Laura Juanita Acosta Ríos", email: "juanita.acosta@cesa.edu.co", phone: "3118701563" },
      { name: "Sofía Silva Escobar", email: "Sofia.silvae@cesa.edu.co", phone: "3152296798" },
      { name: "Natalia Paola Fuentes Ibáñez", email: "Natalia.fuentes@cesa.edu.co", phone: "3175752056" },
      { name: "Sara Gabriela Janica Piñeros", email: "Sara.janica@cesa.edu.co", phone: "3195633622" },
    ],
  },
  {
    name: "FACEA UACH 1",
    members: [
      { name: "Josefa Belén Aravena Carrasco", email: "josefa.aravena@alumnos.uach.cl", phone: "56997082326" },
      { name: "Benjamín Herrera", email: "josefa.aravena@alumnos.uach.cl", phone: "4916092260438" },
      { name: "Maira Gallardo Burgos", email: "maira.gallardo@alumnos.uach.cl", phone: "56949894440" },
      { name: "Antonia Andrade Barreaux", email: "antonia.andrade01@alumnos.uach.cl", phone: "34632264371" },
    ],
  },
  {
    name: "MJAI consulting",
    members: [
      { name: "Antonia Marulanda  Montes", email: "a.marulanda@uniandes.edu.co", phone: "3192767775" },
      { name: "Isabella Marin Perez", email: "I.marin1@uniandes.edu.co", phone: "3137764850" },
      { name: "Mariana De los angeles Páez Martínez", email: "m.paezm@uniandes.edu.co", phone: "3106010954" },
      { name: "Julieth Gomez Blanco", email: "js.gomez2@uniandes.edu.co", phone: "3022293660" },
    ],
  },
  {
    name: "UACH FACEA 2",
    members: [
      { name: "Ian Hoffmann", email: "ian.hoffmann@alumnos.uach.cl", phone: "56962395844" },
      { name: "Fernanda Montero Sanhueza", email: "fernanda.montero@alumnos.uach.cl", phone: "56967779437" },
      { name: "Joseline Salgado Montero", email: "joseline.salgado@alumnos.uach.cl", phone: "56949288576" },
      { name: "Nicole Gallardo", email: "nicole.gallardo01@alumnos.uach.cl", phone: "56982790830" },
    ],
  },
  {
    name: "CESA CONS",
    members: [
      { name: "Paloma Valencia", email: "paloma.valencia@cesa.edu.co", phone: "3213920698" },
      { name: "Juan Felipe Pardo", email: "juan.pardo@cesa.edu.co", phone: "3205803844" },
      { name: "Zharick Orejuela Salazar", email: "zharick.orejuela@cesa.edu.co", phone: "3212126059" },
      { name: "Alejandro Gonzalez Serna", email: "alejandro.gonzalez@cesa.edu.co", phone: "3504309499" },
    ],
  },
  {
    name: "Los Pensadores",
    members: [
      { name: "Tobias Meneghin", email: "tmeneghin@uade.edu.ar", phone: "2914313413" },
      { name: "Luciano Eric Pinget", email: "lucianopinget1@gmail.com", phone: "5491126645573" },
      { name: "Ian Luca Bonaldi", email: "ianbonaldii@gmail.com", phone: "1157313790" },
      { name: "Julián Rodríguez", email: "jc.rodriguez2@uniandes.edu.co", phone: "3202518070" },
    ],
  },
  {
    name: "UNIVERSIDAD INDOAMERICA - EQUIPO 1",
    members: [
      { name: "DAYANA MONSERRATH JIMENEZ", email: "dayanajimenezp22@outlook.es", phone: "593988359662" },
      { name: "JORGE ALEJANDRO VILLALVA NARANJO", email: "villalvaj867@gmail.com", phone: "593999833586" },
      { name: "MATIAS SEBASTIAN VALENZUELA BARROS", email: "matiasvalenzuela389@gmail.com", phone: "593962082760" },
      { name: "RANIA CAROLINA CAICEDO VILLACIS", email: "carolinacaicedo635@gmail.com", phone: "593985942265" },
    ],
  },
  {
    name: "Noesis Group",
    members: [
      { name: "Karen Nicole Acevedo Mendez", email: "karenaceme@unisabana.edu.co", phone: "3002936985" },
      { name: "Karen Ximena Sepúlveda Bernal", email: "karensebe@unisabana.edu.co", phone: "3112724563" },
      { name: "Nicolás López González", email: "nicolaslogo@unisabana.edu.co", phone: "3043228858" },
      { name: "Sebastian Santos Santos", email: "sebastiansansa@unisabana.edu.co", phone: "3108824422" },
    ],
  },
  {
    name: "UNIVERSIDAD INDOAMERICA - EQUIPO 2",
    members: [
      { name: "ALISON SOLANGE PARADES CHASI", email: "alisonparedes277@gmail.com", phone: "593992629542" },
      { name: "EVELYN CAROLINA MORENO IZA", email: "evelyn.carito79@gmail.com", phone: "593961742516" },
      { name: "ALISON SAMANTHA MEDINA ABRIL", email: "alisonmedina659@gmail.com", phone: "593983922941" },
      { name: "ESTEBAN MATEO AGUIERRE SANCHEZ", email: "esteban2210aguirre@gmail.com", phone: "593998147272" },
    ],
  },
  {
    name: "UNIVERSIDAD INDOAMERICA - EQUIPO 3",
    members: [
      { name: "KERLY ANAHI JUNTA GAVILANES", email: "kerlyjuntabe@gmail.com", phone: "593987368849" },
      { name: "DANIELA MICHELLE VACA ALDAS", email: "danivaca203@gmail.com", phone: "593995595456" },
      { name: "LEANDRO SILVA CAMPOVERDE", email: "leandro20020605@gmail.com", phone: "593968610819" },
      { name: "ANGEL DARIO VEINTIMILLA HERRERA", email: "angelveintimilla576@gmail.com", phone: "593983943380" },
    ],
  },
  {
    name: "Strata",
    members: [
      { name: "Maria Monica Rojas Trillos", email: "rojastrillosm@gmail.com", phone: "3157289945" },
      { name: "Juan David Guzman", email: "jd.guzman23@uniandes.edu.co", phone: "3115673928" },
      { name: "Catalina Maestre", email: "lm.maestre@uniandes.edu.co", phone: "3143578034" },
      { name: "Alejandro Zambrano", email: "da.zambrano2@uniandes.edu.co", phone: "3014399334" },
    ],
  },
  {
    name: "Consultores Musicoadministradores",
    members: [
      { name: "María Inés Díaz", email: "mi.diaz2@uniandes.edu.co", phone: "3124855108" },
      { name: "Ana María González", email: "anama.gonzalezf2@gmail.com", phone: "3057002222" },
      { name: "Andrés Díaz", email: "a.diazb2@uniandes.edu.co", phone: "3196553348" },
      { name: "Valeria Bulla", email: "v.bulla@uniandes.edu.co", phone: "3177548889" },
    ],
  },
  {
    name: "UR Monjes",
    members: [
      { name: "Juan Esteban Triviño Betancourt", email: "juane.trivino@urosario.edu.co", phone: "3124482860" },
      { name: "Smaily Arenas", email: "smaily.arenas@urosario.edu.co", phone: "3175681460" },
      { name: "David Rodriguez", email: "david.rodriguezar@urosario.edu.co", phone: "3127701080" },
      { name: "Jacobo Castaño", email: "jacobocastanopardo@gmail.com", phone: "3046085362" },
    ],
  },
  {
    name: "GILDCO",
    members: [
      { name: "Pablo Apráez Abril", email: "papraez06@gmail.com", phone: "3125180057" },
      { name: "Sebastián Barrera", email: "sebasbarreraguzman@gmail.com", phone: "3164984056" },
      { name: "Santiago García de la Concha", email: "santiagodlc2006@gmail.com", phone: "3232360094" },
      { name: "Leonardo Sánchez", email: "leonardosbal417@gmail.com", phone: "3053145723" },
    ],
  },
  {
    name: "IBBM Group",
    members: [
      { name: "Ignacio Leiva Garrido", email: "igleiva2022@udec.cl", phone: "968970090" },
      { name: "Benjamín Cutiño Pacheco", email: "Bcutino2022@udec.cl", phone: "971641404" },
      { name: "Benjamín Henríquez Torres", email: "Bhenriquez2022@udec.cl", phone: "954678898" },
      { name: "Marcelo Vargas Troncoso", email: "Mavargas2022@udec.cl", phone: "984219648" },
    ],
  },
  {
    name: "BCG (Barely Consulting Group)",
    members: [
      { name: "Sofía Sanabria", email: "sofia.sanabriap1106@gmail.com", phone: "3138575800" },
      { name: "Andrés Herrera Muñoz", email: "andres.herrera13424@gmail.com", phone: "3113236730" },
      { name: "Maya Misteli", email: "mayamisteli@gmail.com", phone: "3124635687" },
      { name: "Santiago Rodriguez Llinas", email: "santiagorll25@hotmail.com", phone: "3117536401" },
    ],
  },
  {
    name: "SCG",
    members: [
      { name: "Marie Elisa Aguilar", email: "marieagpe@unisabana.edu.co", phone: "3185409490" },
      { name: "Santiago Zambrano Iregui", email: "santiagozair@unisabana.edu.co", phone: "3188147439" },
      { name: "Cristian Felipe Forero Bejarano", email: "cristianfobe@unisabana.edu.co", phone: "3005508177" },
      { name: "Manuela Rubio Barragán", email: "manuelaruba@unisabana.edu.co", phone: "3103347562" },
    ],
  },
  {
    name: "Fourward",
    members: [
      { name: "Sophia Bernal Trujillo", email: "sophiabetr@unisabana.edu.co", phone: "3123150149" },
      { name: "Julian Gil Mejia", email: "juliangilme@gmail.com", phone: "3015292404" },
      { name: "Mateo Montes Montes", email: "mateomomo@unisabana.edu.co", phone: "3223126260" },
      { name: "Isabella Jiménez Macías", email: "isabellajimenezmacl@gmail.com", phone: "3004454159" },
    ],
  },
  {
    name: "MRCR",
    members: [
      { name: "Jacobo Rojas Uribe", email: "jacoborojasu@gmail.com", phone: "3144762721" },
      { name: "Sofía Carvajal Diaz", email: "sofiacarvajaldiaz05@gmail.com", phone: "3127230178" },
      { name: "Ana Sofía Miranda", email: "ana.miranda@cesa.edu.co", phone: "3163314628" },
      { name: "Laura Romero", email: "Laura02viviana@gmail.com", phone: "3219870843" },
    ],
  },
  {
    name: "Consultores Pro",
    members: [
      { name: "Juan Esteban Salamanca", email: "j.salamancav@uniandes.edu.co", phone: "3186237524" },
      { name: "Valentina Ramirez Pardo", email: "V.ramirezp2@uniandes.edu.co", phone: "3005587157" },
      { name: "Jose Luis Meneses", email: "jl.meneses@uniandes.edu.co", phone: "3046334216" },
      { name: "Iván Camilo Garcia", email: "ic.garcia@uniandes.edu.co", phone: "3204298735" },
    ],
  },
  {
    name: "Praxis",
    members: [
      { name: "Youichi David Tanaka Escobar", email: "yodatnk@gmail.com", phone: "3157975463" },
      { name: "Juan Luis Guevara Bustamante", email: "jguevarabustamante25@gmail.com", phone: "3015684446" },
      { name: "David Arce Rivera", email: "davidarcer343@gmail.com", phone: "3023622334" },
      { name: "Camilo Andres Quiñonez", email: "camiloquiba789@gmail.com", phone: "3157144076" },
    ],
  },
  {
    name: "MV & TN",
    members: [
      { name: "Tomas Lozano Sanint", email: "tommyloza2005@gmail.com", phone: "3127514940" },
      { name: "Nicolás Duarte Jaraba", email: "nicolasduartejaraba@gmail.com", phone: "3102944284" },
      { name: "Mariana Gomez Vivas", email: "marigomezvivas@gmail.com", phone: "3204777768" },
      { name: "Valerie Ritzel", email: "valerieritzel05@gmail.com", phone: "3157635333" },
    ],
  },
  {
    name: "Procorp",
    members: [
      { name: "Andrés Felipe Parra Alvarado", email: "Andresfelip.parra@urosario.edu.co", phone: "3123371312" },
      { name: "Luz Madeleine Suárez Manzano", email: "madeleinesuarezm@gmail.com", phone: "3142641350" },
      { name: "Alejandro Pacheco Guerrero", email: "Apachegue14@gmail.com", phone: "3137807878" },
      { name: "Mariana Valentina Ortega Aguilera", email: "Mvortegaguilera@gmail.com", phone: "3183282987" },
    ],
  },
  {
    name: "MindShift",
    members: [
      { name: "David Alejandro Suárez Escorcia", email: "davidale.suarez@urosario.edu.co", phone: "3192944937" },
      { name: "Daniela Hurtado Gutiérrez", email: "daniela.hurtadog@urosario.edu.co", phone: "3108009037" },
      { name: "María Valentina Suárez Ayala", email: "mariava.suarez@urosario.edu.co", phone: "3204895176" },
      { name: "Juan David Parra Tobías", email: "juandavid.parra@urosario.edu.co", phone: "3192716827" },
    ],
  },
  {
    name: "Case Crackers 2.0",
    members: [
      { name: "JOSE SEBASTIAN ZAMBRANO RUBI", email: "jsebastianrubijob@gmail.com", phone: "3144047192" },
      { name: "Ellin Jazmin Orjuela Santoyo", email: "ellinjazmin@gmail.com", phone: "573204766076" },
      { name: "Julián Steven Luna Romero", email: "julianecono7@gmail.com", phone: "573142064660" },
      { name: "Jerónimo Jiménez Castañeda", email: "Jerocastajimenez@gmail.com", phone: "573118413849" },
    ],
  },
  {
    name: "Los inges al cubo",
    members: [
      { name: "Brian Nicolss Guzman Orjuela", email: "bguzmano@unal.edu.co", phone: "3223588235" },
      { name: "Lucía Anell", email: "lucia.anell@utp.ac.pa", phone: "66887838" },
      { name: "Luz Enciso", email: "luz.enciso@utp.ac.pa", phone: "62145815" },
      { name: "Joshua Miller", email: "joshua.miller@utp.ac.pa", phone: "63151505" },
    ],
  },
  {
    name: "Nime consulting group",
    members: [
      { name: "Mariana López Cobos", email: "m.lopezc23@uniandes.edu.co", phone: "3173705541" },
      { name: "Isabella Urdinola Hernandez", email: "i.urdinola@uniandes.edu.co", phone: "3117871747" },
      { name: "Emilio Espinosa Palacio", email: "emilio16espinosa2113@gmail.com", phone: "3232283457" },
      { name: "Nicolle Sanchez", email: "nicollesolangel@outlook.com", phone: "3134922842" },
    ],
  },
];
