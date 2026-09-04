import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppModule } from '../app.module';
import { Job } from '../jobs/entities/job.entity';
import { jobStatus } from '../jobs/enum/jobs-status.enum';

type SeedJob = {
    title: string;
    description: string;
    companyName: string;
    streetNumber: number;
    streetName: string;
    zipCode: number;
    cityName: string;

    // Coordonnées simulant l'ancien fournisseur.
    latitude: number;
    longitude: number;
};

const jobs: SeedJob[] = [
    {
        title: 'Développeur Backend Node.js',
        description:
            'Conception et développement de services backend Node.js pour une plateforme web à forte disponibilité.',
        companyName: 'NovaTech Solutions',
        streetNumber: 10,
        streetName: 'Rue de Rivoli',
        zipCode: 75001,
        cityName: 'Paris',
        latitude: 48.8628,
        longitude: 2.3378,
    },
    {
        title: 'Développeur Frontend React',
        description:
            'Développement d’interfaces React modernes, accessibles et adaptées aux usages desktop et mobile.',
        companyName: 'HexaDigital',
        streetNumber: 35,
        streetName: 'Boulevard de Sébastopol',
        zipCode: 75001,
        cityName: 'Paris',
        latitude: 48.8649,
        longitude: 2.3526,
    },
    {
        title: 'Ingénieur DevOps',
        description:
            'Automatisation des déploiements, maintenance des pipelines CI/CD et exploitation des infrastructures cloud.',
        companyName: 'BlueStack',
        streetNumber: 22,
        streetName: 'Rue du Faubourg Saint-Antoine',
        zipCode: 75012,
        cityName: 'Paris',
        latitude: 48.8522,
        longitude: 2.3725,
    },
    {
        title: 'Développeur C++',
        description:
            'Développement de composants logiciels performants en C++ dans un environnement industriel exigeant.',
        companyName: 'Orion Systems',
        streetNumber: 18,
        streetName: 'Avenue Daumesnil',
        zipCode: 75012,
        cityName: 'Paris',
        latitude: 48.8469,
        longitude: 2.3775,
    },
    {
        title: 'Ingénieur Cybersécurité',
        description:
            'Analyse des risques, durcissement des systèmes et accompagnement des équipes sur les bonnes pratiques de sécurité.',
        companyName: 'SecuraLab',
        streetNumber: 42,
        streetName: 'Rue de Tolbiac',
        zipCode: 75013,
        cityName: 'Paris',
        latitude: 48.8269,
        longitude: 2.3601,
    },
    {
        title: 'Data Analyst',
        description:
            'Analyse de données métier et création de tableaux de bord décisionnels à destination des équipes opérationnelles.',
        companyName: 'DataNova',
        streetNumber: 16,
        streetName: 'Boulevard Saint-Germain',
        zipCode: 75005,
        cityName: 'Paris',
        latitude: 48.8494,
        longitude: 2.3547,
    },
    {
        title: 'Administrateur Systèmes Linux',
        description:
            'Administration de serveurs Linux, supervision des services et amélioration de la disponibilité des infrastructures.',
        companyName: 'InfraSphere',
        streetNumber: 28,
        streetName: 'Rue de la Convention',
        zipCode: 75015,
        cityName: 'Paris',
        latitude: 48.8425,
        longitude: 2.2878,
    },
    {
        title: 'Chef de Projet IT',
        description:
            'Pilotage de projets numériques, coordination des équipes techniques et suivi des engagements de livraison.',
        companyName: 'Nexa Conseil',
        streetNumber: 55,
        streetName: 'Rue de Clichy',
        zipCode: 75009,
        cityName: 'Paris',
        latitude: 48.8794,
        longitude: 2.3289,
    },
    {
        title: 'Développeur Python',
        description:
            'Développement de services Python et automatisation de traitements de données.',
        companyName: 'Asteria Software',
        streetNumber: 14,
        streetName: 'Avenue Jean Jaurès',
        zipCode: 75019,
        cityName: 'Paris',
        latitude: 48.8832,
        longitude: 2.3708,
    },
    {
        title: 'Technicien Réseaux',
        description:
            'Installation, maintenance et supervision des équipements réseau d’un parc multi-sites.',
        companyName: 'NetAxis',
        streetNumber: 30,
        streetName: 'Rue de Ménilmontant',
        zipCode: 75020,
        cityName: 'Paris',
        latitude: 48.8659,
        longitude: 2.3865,
    },

    // Petite couronne
    {
        title: 'Ingénieur Cloud',
        description:
            'Conception et exploitation d’architectures cloud sécurisées et hautement disponibles.',
        companyName: 'CloudForge',
        streetNumber: 12,
        streetName: 'Avenue Anatole France',
        zipCode: 92110,
        cityName: 'Clichy',
        latitude: 48.9045,
        longitude: 2.3068,
    },
    {
        title: 'Développeur Full Stack',
        description:
            'Développement d’applications web modernes sur une stack TypeScript, Node.js et React.',
        companyName: 'PixelWorks',
        streetNumber: 25,
        streetName: 'Rue de Paris',
        zipCode: 92100,
        cityName: 'Boulogne-Billancourt',
        latitude: 48.8356,
        longitude: 2.2397,
    },
    {
        title: 'Ingénieur Logiciel',
        description:
            'Conception d’architectures logicielles robustes et développement de services à forte valeur métier.',
        companyName: 'Kernellia',
        streetNumber: 8,
        streetName: 'Avenue de la République',
        zipCode: 93100,
        cityName: 'Montreuil',
        latitude: 48.8618,
        longitude: 2.4382,
    },
    {
        title: 'Développeur Java',
        description:
            'Développement et maintenance d’applications Java destinées à des systèmes d’information métiers.',
        companyName: 'Synapse Tech',
        streetNumber: 20,
        streetName: 'Rue Jean Jaurès',
        zipCode: 92800,
        cityName: 'Puteaux',
        latitude: 48.8844,
        longitude: 2.2390,
    },
    {
        title: 'Ingénieur QA',
        description:
            'Définition et automatisation des stratégies de tests fonctionnels et techniques.',
        companyName: 'QualityOne',
        streetNumber: 15,
        streetName: 'Avenue Paul Vaillant-Couturier',
        zipCode: 94400,
        cityName: 'Vitry-sur-Seine',
        latitude: 48.7905,
        longitude: 2.3908,
    },

    // Autres grandes villes françaises
    {
        title: 'Développeur Logiciel Embarqué',
        description:
            'Développement de logiciels embarqués en C et C++ pour des équipements industriels.',
        companyName: 'Armor Embedded',
        streetNumber: 1,
        streetName: 'Rue Louis Braille',
        zipCode: 35136,
        cityName: 'Saint-Jacques-de-la-Lande',
        latitude: 48.0675,
        longitude: -1.7218,
    },
    {
        title: 'Ingénieur Systèmes',
        description:
            'Conception et intégration de systèmes informatiques complexes dans un environnement industriel.',
        companyName: 'Bretagne Systems',
        streetNumber: 10,
        streetName: 'Rue de la Monnaie',
        zipCode: 35000,
        cityName: 'Rennes',
        latitude: 48.1138,
        longitude: -1.6817,
    },
    {
        title: 'Développeur Web',
        description:
            'Conception d’applications web métiers avec une attention particulière portée à l’accessibilité.',
        companyName: 'Loire Digital',
        streetNumber: 4,
        streetName: 'Place Graslin',
        zipCode: 44000,
        cityName: 'Nantes',
        latitude: 47.2149,
        longitude: -1.5636,
    },
    {
        title: 'Architecte Logiciel',
        description:
            'Définition d’architectures applicatives et accompagnement des équipes de développement.',
        companyName: 'Aquitaine Tech',
        streetNumber: 12,
        streetName: 'Cours de l’Intendance',
        zipCode: 33000,
        cityName: 'Bordeaux',
        latitude: 44.8422,
        longitude: -0.5789,
    },
    {
        title: 'Ingénieur Data',
        description:
            'Construction de pipelines de données et industrialisation des traitements analytiques.',
        companyName: 'Occitan Data',
        streetNumber: 15,
        streetName: 'Rue d’Alsace Lorraine',
        zipCode: 31000,
        cityName: 'Toulouse',
        latitude: 43.6065,
        longitude: 1.4448,
    },
    {
        title: 'Développeur Mobile',
        description:
            'Développement d’applications mobiles performantes et ergonomiques pour Android et iOS.',
        companyName: 'Rhône Apps',
        streetNumber: 10,
        streetName: 'Rue de la République',
        zipCode: 69001,
        cityName: 'Lyon',
        latitude: 45.7660,
        longitude: 4.8368,
    },
    {
        title: 'Administrateur Cloud',
        description:
            'Exploitation et sécurisation d’environnements cloud et automatisation des opérations.',
        companyName: 'Alpes Cloud',
        streetNumber: 2,
        streetName: 'Place Grenette',
        zipCode: 38000,
        cityName: 'Grenoble',
        latitude: 45.1910,
        longitude: 5.7265,
    },
    {
        title: 'Développeur Backend Go',
        description:
            'Développement de microservices Go performants et d’API destinées à des applications métier.',
        companyName: 'Méditerranée Software',
        streetNumber: 25,
        streetName: 'La Canebière',
        zipCode: 13001,
        cityName: 'Marseille',
        latitude: 43.2975,
        longitude: 5.3775,
    },
    {
        title: 'Ingénieur Réseaux',
        description:
            'Conception, supervision et sécurisation d’infrastructures réseau multisites.',
        companyName: 'Azur Networks',
        streetNumber: 5,
        streetName: 'Avenue Jean Médecin',
        zipCode: 6000,
        cityName: 'Nice',
        latitude: 43.7015,
        longitude: 7.2669,
    },

    // Compléments d'adresse
    {
        title: 'Développeur TypeScript',
        description:
            'Développement de services TypeScript et participation à l’évolution d’une plateforme SaaS.',
        companyName: 'Alsace Digital',
        streetNumber: 8,
        streetName: 'Rue des Grandes Arcades Bâtiment A',
        zipCode: 67000,
        cityName: 'Strasbourg',
        latitude: 48.5835,
        longitude: 7.7485,
    },
    {
        title: 'Ingénieur DevSecOps',
        description:
            'Automatisation de la sécurité dans les chaînes de développement et de déploiement.',
        companyName: 'NordSec',
        streetNumber: 20,
        streetName: 'Rue Nationale Entrée B',
        zipCode: 59000,
        cityName: 'Lille',
        latitude: 50.6375,
        longitude: 3.0624,
    },
    {
        title: 'Product Owner',
        description:
            'Pilotage de la roadmap produit et coordination entre utilisateurs, métier et équipes techniques.',
        companyName: 'Normandie Numérique',
        streetNumber: 15,
        streetName: 'Rue du Gros Horloge 2e étage',
        zipCode: 76000,
        cityName: 'Rouen',
        latitude: 49.4410,
        longitude: 1.0935,
    },
    {
        title: 'Développeur .NET',
        description:
            'Conception et maintenance d’applications métiers sur l’écosystème Microsoft .NET.',
        companyName: 'Anjou Software',
        streetNumber: 5,
        streetName: 'Boulevard Foch Bâtiment C',
        zipCode: 49100,
        cityName: 'Angers',
        latitude: 47.4736,
        longitude: -0.5535,
    },

    // Adresses volontairement invalides
    {
        title: 'Ingénieur Plateforme',
        description:
            'Développement et exploitation d’une plateforme technique distribuée.',
        companyName: 'Futura Systems',
        streetNumber: 9999,
        streetName: 'Rue du Dragon Magique Inexistante',
        zipCode: 75001,
        cityName: 'Paris',
        latitude: 48.8566,
        longitude: 2.3522,
    },
    {
        title: 'Développeur API',
        description:
            'Conception d’API REST et intégration de services métiers.',
        companyName: 'Arcadia Technologies',
        streetNumber: 404,
        streetName: 'Avenue Absolument Inexistante',
        zipCode: 35000,
        cityName: 'Rennes',
        latitude: 48.1173,
        longitude: -1.6778,
    },
];

async function main() {
    console.log('========================================');
    console.log(' GéoEmploi - Seed migration');
    console.log('========================================');

    const app = await NestFactory.createApplicationContext(AppModule);

    const jobRepo = app.get<Repository<Job>>(
        getRepositoryToken(Job),
    );

    /**
     * ATTENTION :
     * Cette commande supprime toutes les offres présentes.
     * À utiliser UNIQUEMENT sur la base de test destinée
     * à la validation de la migration.
     */
    await jobRepo.clear();

    console.log('Anciennes offres supprimées.');
    console.log(`Insertion de ${jobs.length} offres...`);
    console.log('');

    let inserted = 0;

    for (const seed of jobs) {
        const job = new Job();

        job.title = seed.title;
        job.description = seed.description;
        job.companyName = seed.companyName;

        job.streetNumber = seed.streetNumber;
        job.streetName = seed.streetName;
        job.zipCode = seed.zipCode;
        job.cityName = seed.cityName;

        /**
         * Ces coordonnées représentent volontairement
         * les anciennes coordonnées provenant du fournisseur
         * de géocodage historique.
         *
         * Le script de reprise devra les remplacer.
         */
        job.latitude = seed.latitude;
        job.longitude = seed.longitude;

        /**
         * Source volontairement NON conforme.
         * Ainsi migrationScript() ne considérera pas
         * l'offre comme déjà migrée.
         */
        job.geocodageSource = 'legacy-geocoder';

        /**
         * Valeurs historiques simulées.
         * Elles restent non conformes car la source
         * n'est pas api-adresse.data.gouv.fr.
         */
        job.trustScore = 0.5;
        job.obtentionDate = new Date('2026-09-01T10:00:00.000Z');

        job.employerId = 1;
        job.status = jobStatus.ACTIVE;

        await jobRepo.save(job);

        inserted++;

        console.log(
            `[SEEDED] ${inserted}/${jobs.length} - ` +
            `${job.title} - ` +
            `${job.streetNumber} ${job.streetName}, ` +
            `${job.zipCode} ${job.cityName}`,
        );
    }

    console.log('');
    console.log('========================================');
    console.log(' Seed terminé');
    console.log('========================================');
    console.log(`Offres insérées : ${inserted}`);
    console.log(`Source initiale : legacy-geocoder`);
    console.log('');
    console.log(
        'Vous pouvez maintenant exécuter le script de reprise.',
    );

    await app.close();
}

main().catch((error) => {
    console.error('Erreur fatale pendant le seed :', error);
    process.exit(1);
});
