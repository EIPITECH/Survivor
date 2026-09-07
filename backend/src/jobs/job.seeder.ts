import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

const RENNES_JOB_OFFERS: CreateJobDto[] = [
  {
    title: 'Développeur(euse) Full Stack Node.js/React',
    description: "Rejoignez une équipe produit de six personnes pour faire évoluer une plateforme SaaS utilisée par plus de deux cents entreprises bretonnes. Vous interviendrez sur l'ensemble de la chaîne technique, du backend NestJS au frontend React, avec du télétravail partiel possible dès la période d'essai validée.",
    cityName: 'Rennes',
    streetNumber: 12,
    streetName: 'Rue de la Chalotais',
    zipCode: 35000,
    companyName: 'Nova Technologies',
  },
  {
    title: 'Infirmier(ère) diplômé(e) d\'État - service gériatrie',
    description: "Poste en CDI à temps plein au sein d'un service de gériatrie de 28 lits. Vous travaillerez en équipe pluridisciplinaire avec un ratio patient/soignant maîtrisé, plannings établis un mois à l'avance et reprise d'ancienneté selon convention collective.",
    cityName: 'Rennes',
    streetNumber: 4,
    streetName: 'Rue Papu',
    zipCode: 35700,
    companyName: 'Clinique du Blosne',
  },
  {
    title: 'Comptable unique H/F',
    description: "PME de vingt-cinq salariés recherche son(sa) comptable pour gérer la comptabilité générale, les déclarations de TVA et les relations avec l'expert-comptable externe. Maîtrise de Sage et rigueur administrative indispensables.",
    cityName: 'Cesson-Sévigné',
    streetNumber: 8,
    streetName: 'Rue de Rennes',
    zipCode: 35510,
    companyName: 'Armorik Ingénierie',
  },
  {
    title: 'Boulanger(ère) pâtissier(ère)',
    description: "Boulangerie artisanale de quartier cherche un(e) boulanger(ère) pour rejoindre une équipe de trois personnes. Fournil traditionnel, farines locales, horaires du matin avec repos le dimanche et le lundi.",
    cityName: 'Rennes',
    streetNumber: 3,
    streetName: 'Place des Lices',
    zipCode: 35000,
    companyName: 'Boulangerie des Lices',
  },
  {
    title: 'Technicien(ne) de maintenance industrielle',
    description: "Vous assurerez la maintenance préventive et curative de lignes de production automatisées, avec astreintes ponctuelles. Formation en interne sur les équipements spécifiques et évolution possible vers un poste de référent technique.",
    cityName: 'Bruz',
    streetNumber: 15,
    streetName: 'Avenue du Général de Gaulle',
    zipCode: 35170,
    companyName: 'Ker Logistique',
  },
  {
    title: 'Data Analyst H/F',
    description: "Au sein d'une direction data de huit personnes, vous construirez les tableaux de bord destinés aux équipes commerciales et marketing sous Power BI, et participerez à la fiabilisation des pipelines SQL existants.",
    cityName: 'Rennes',
    streetNumber: 21,
    streetName: 'Rue Jules Simon',
    zipCode: 35000,
    companyName: 'Breizh Data Solutions',
  },
  {
    title: 'Aide-soignant(e) - EHPAD',
    description: "Établissement de soixante-dix résidents recherche un(e) aide-soignant(e) pour compléter son équipe de nuit. Binôme systématique, matériel de manutention récent et primes de nuit incluses selon convention.",
    cityName: 'Saint-Jacques-de-la-Lande',
    streetNumber: 6,
    streetName: 'Rue de la Mairie',
    zipCode: 35136,
    companyName: 'Vilaine Santé',
  },
  {
    title: 'Chef de projet BTP',
    description: "Vous piloterez des chantiers de rénovation énergétique de bâtiments tertiaires, de la consultation des entreprises jusqu'à la réception des travaux. Véhicule de service fourni et déplacements limités au bassin rennais.",
    cityName: 'Rennes',
    streetNumber: 45,
    streetName: 'Boulevard de la Liberté',
    zipCode: 35000,
    companyName: 'Cristal Bâtiment',
  },
  {
    title: 'Serveur(se) en restauration',
    description: "Restaurant de cuisine bretonne traditionnelle recherche un(e) serveur(se) pour le service du midi et du soir, du mardi au samedi. Équipe soudée et pourboires reversés intégralement au personnel de salle.",
    cityName: 'Rennes',
    streetNumber: 2,
    streetName: 'Rue Saint-Georges',
    zipCode: 35000,
    companyName: 'Le Comptoir Rennais',
  },
  {
    title: 'Ingénieur(e) réseaux et sécurité',
    description: "Vous superviserez l'infrastructure réseau de plusieurs sites clients, gérerez les pare-feux et interviendrez sur les incidents de niveau 3. Astreintes rémunérées une semaine sur quatre.",
    cityName: 'Rennes',
    streetNumber: 9,
    streetName: 'Rue de Lorient',
    zipCode: 35000,
    companyName: 'Breizh Data Solutions',
  },
  {
    title: 'Auxiliaire de vie sociale',
    description: "Vous accompagnerez des personnes âgées ou en situation de handicap à leur domicile pour les actes de la vie quotidienne. Secteur d'intervention resserré autour de Rennes centre, frais kilométriques indemnisés.",
    cityName: 'Rennes',
    streetNumber: 17,
    streetName: 'Rue d\'Antrain',
    zipCode: 35700,
    companyName: 'Ouest Services à la Personne',
  },
  {
    title: 'Assistant(e) ressources humaines',
    description: "Vous participerez au recrutement, à l'administration du personnel et au suivi de la formation pour un effectif de cent-vingt salariés. Poste polyvalent avec un fort volet relationnel.",
    cityName: 'Rennes',
    streetNumber: 30,
    streetName: 'Avenue Janvier',
    zipCode: 35000,
    companyName: 'Ouest Services RH',
  },
  {
    title: 'Mécanicien(ne) automobile',
    description: "Garage indépendant de trois ponts recherche un(e) mécanicien(ne) confirmé(e) pour l'entretien courant et les diagnostics électroniques. Outillage fourni et prime sur objectifs qualité.",
    cityName: 'Rennes',
    streetNumber: 11,
    streetName: 'Rue de Villejean',
    zipCode: 35000,
    companyName: 'Garage Villejean',
  },
  {
    title: 'Professeur(e) des écoles - remplacement',
    description: "École primaire privée sous contrat recherche un(e) enseignant(e) pour un remplacement de longue durée en classe de CE2. Equipe pédagogique de huit enseignants et projet d'établissement axé sur les langues.",
    cityName: 'Rennes',
    streetNumber: 5,
    streetName: 'Rue de Dinan',
    zipCode: 35000,
    companyName: 'École Sainte-Cécile',
  },
  {
    title: 'Agent(e) immobilier(ère)',
    description: "Agence indépendante recherche un(e) négociateur(rice) pour développer un portefeuille de biens résidentiels sur Rennes et sa périphérie. Fixe garanti les six premiers mois puis commissions attractives.",
    cityName: 'Rennes',
    streetNumber: 14,
    streetName: 'Rue Vasselot',
    zipCode: 35000,
    companyName: 'Cristal Immobilier',
  },
  {
    title: 'Conducteur(rice) de bus urbain',
    description: "Réseau de transport en commun recherche des conducteurs(rices) titulaires du permis D et de la FIMO voyageurs. Formation interne complémentaire assurée avant la prise de poste.",
    cityName: 'Rennes',
    streetNumber: 22,
    streetName: 'Rue de Fougères',
    zipCode: 35700,
    companyName: 'Autocars de la Vilaine',
  },
  {
    title: 'Community manager H/F',
    description: "Vous animerez les réseaux sociaux d'une dizaine de clients locaux, de la création de contenu au suivi des statistiques d'engagement. Profil créatif à l'aise avec la vidéo courte et la photographie de produit.",
    cityName: 'Rennes',
    streetNumber: 7,
    streetName: 'Quai Duguay-Trouin',
    zipCode: 35000,
    companyName: 'Studio Odyssée',
  },
  {
    title: 'Électricien(ne) bâtiment',
    description: "Entreprise d'électricité générale recherche un(e) électricien(ne) pour des chantiers de rénovation chez des particuliers et petites copropriétés. Véhicule et outillage fournis, panier repas inclus.",
    cityName: 'Chantepie',
    streetNumber: 4,
    streetName: 'Rue de Rennes',
    zipCode: 35135,
    companyName: 'Armorik Ingénierie',
  },
  {
    title: 'Pharmacien(ne) adjoint(e)',
    description: "Officine de quartier recherche un(e) pharmacien(ne) adjoint(e) pour compléter une équipe de quatre personnes. Conseil patient, préparations magistrales occasionnelles et logiciel LGPI déjà en place.",
    cityName: 'Rennes',
    streetNumber: 19,
    streetName: 'Rue du Colombier',
    zipCode: 35000,
    companyName: 'Pharmacie du Colombier',
  },
  {
    title: 'Magasinier(ère) cariste',
    description: "Entrepôt logistique recherche un(e) cariste titulaire des CACES 1, 3 et 5 pour la réception, le stockage et la préparation de commandes. Horaires en 2x8 avec majoration pour le poste de nuit.",
    cityName: 'Cesson-Sévigné',
    streetNumber: 33,
    streetName: 'Rue de Rennes',
    zipCode: 35510,
    companyName: 'Ker Logistique',
  },
  {
    title: 'Coiffeur(euse) mixte',
    description: "Salon de coiffure indépendant recherche un(e) coiffeur(euse) polyvalent(e) coupe, couleur et coiffage événementiel. Clientèle fidélisée et produits professionnels haut de gamme.",
    cityName: 'Rennes',
    streetNumber: 6,
    streetName: 'Rue de Robien',
    zipCode: 35000,
    companyName: 'Coiffure Créative Villejean',
  },
  {
    title: 'Chargé(e) d\'affaires en assurance',
    description: "Cabinet de courtage recherche un(e) chargé(e) d'affaires pour développer et suivre un portefeuille de clients professionnels en assurance de biens et de responsabilité civile.",
    cityName: 'Rennes',
    streetNumber: 25,
    streetName: 'Rue Saint-Hélier',
    zipCode: 35000,
    companyName: 'Atlantide Conseil',
  },
  {
    title: 'Jardinier(ère) paysagiste',
    description: "Entreprise de paysage recherche un(e) jardinier(ère) pour l'entretien d'espaces verts chez des particuliers et collectivités du bassin rennais. Permis B requis, matériel thermique et électrique fourni.",
    cityName: 'Le Rheu',
    streetNumber: 2,
    streetName: 'Rue de la Mairie',
    zipCode: 35650,
    companyName: 'Bretagne Verte Paysage',
  },
  {
    title: 'Assistant(e) de direction',
    description: "Vous assisterez deux dirigeants dans la gestion de leur agenda, la préparation de dossiers et l'organisation de déplacements professionnels. Discrétion et sens de l'anticipation indispensables.",
    cityName: 'Rennes',
    streetNumber: 10,
    streetName: 'Rue de la Motte Brûlon',
    zipCode: 35000,
    companyName: 'Nova Technologies',
  },
  {
    title: 'Vétérinaire canin et félin',
    description: "Clinique vétérinaire recherche un(e) praticien(ne) pour la médecine et la chirurgie courantes des carnivores domestiques. Plateau technique récent avec échographe et bloc opératoire dédié.",
    cityName: 'Rennes',
    streetNumber: 8,
    streetName: 'Rue de Châtillon',
    zipCode: 35200,
    companyName: 'Vétérinaire du Blosne',
  },
  {
    title: 'Menuisier(ère) d\'agencement',
    description: "Atelier de menuiserie sur mesure recherche un(e) menuisier(ère) pour la fabrication de mobilier et d'agencements intérieurs haut de gamme, du plan à la pose chez le client.",
    cityName: 'Saint-Grégoire',
    streetNumber: 5,
    streetName: 'Avenue du Général de Gaulle',
    zipCode: 35760,
    companyName: 'Menuiserie du Gacet',
  },
  {
    title: 'Conseiller(ère) bancaire particuliers',
    description: "Agence bancaire de proximité recherche un(e) conseiller(ère) pour gérer un portefeuille de clients particuliers, de l'ouverture de compte au conseil en épargne et en crédit immobilier.",
    cityName: 'Rennes',
    streetNumber: 40,
    streetName: 'Rue d\'Isly',
    zipCode: 35000,
    companyName: 'Atlantide Conseil',
  },
  {
    title: 'Agent(e) de sécurité SSIAP 1',
    description: "Centre commercial recherche un(e) agent(e) de sécurité titulaire de la carte professionnelle et du SSIAP 1 pour des rondes de surveillance et la gestion des alarmes incendie.",
    cityName: 'Rennes',
    streetNumber: 1,
    streetName: 'Rue Alsace-Lorraine',
    zipCode: 35000,
    companyName: 'Ouest Services RH',
  },
  {
    title: 'Éducateur(rice) de jeunes enfants',
    description: "Crèche associative de trente berceaux recherche un(e) éducateur(rice) pour animer les temps d'éveil et accompagner l'équipe d'auxiliaires de puériculture au quotidien.",
    cityName: 'Rennes',
    streetNumber: 3,
    streetName: 'Rue de Vern',
    zipCode: 35200,
    companyName: 'Crèche Les Petits Korrigans',
  },
  {
    title: 'Développeur(euse) QA / Testeur(euse)',
    description: "Vous concevrez les scénarios de tests automatisés et manuels d'une application mobile grand public, en lien direct avec les équipes de développement. Cypress et Postman déjà en place.",
    cityName: 'Rennes',
    streetNumber: 18,
    streetName: 'Rue de Nantes',
    zipCode: 35200,
    companyName: 'Nova Technologies',
  },
  {
    title: 'Boucher(ère) charcutier(ère)',
    description: "Commerce de bouche traditionnel recherche un(e) boucher(ère) pour la découpe, la préparation et la vente en boutique. Approvisionnement en circuit court auprès d'éleveurs bretons.",
    cityName: 'Rennes',
    streetNumber: 9,
    streetName: 'Place Sainte-Anne',
    zipCode: 35000,
    companyName: 'Épicerie Fine des Halles',
  },
  {
    title: 'Chargé(e) de clientèle logistique',
    description: "Vous assurerez le suivi des commandes clients, la coordination avec les transporteurs et la gestion des litiges de livraison pour un portefeuille de PME régionales.",
    cityName: 'Cesson-Sévigné',
    streetNumber: 27,
    streetName: 'Rue de Rennes',
    zipCode: 35510,
    companyName: 'Ker Logistique',
  },
  {
    title: 'Professeur(e) de musique - piano',
    description: "École de musique associative recherche un(e) professeur(e) de piano pour des cours individuels et en petits groupes, tous niveaux, du débutant au préparatoire au conservatoire.",
    cityName: 'Rennes',
    streetNumber: 6,
    streetName: 'Rue de la Motte Brûlon',
    zipCode: 35700,
    companyName: 'École de Musique Sainte-Cécile',
  },
  {
    title: 'Maçon(ne) qualifié(e)',
    description: "Entreprise de gros œuvre recherche un(e) maçon(ne) expérimenté(e) pour des chantiers de construction et de rénovation de maisons individuelles autour de Rennes.",
    cityName: 'Pacé',
    streetNumber: 12,
    streetName: 'Avenue du Général de Gaulle',
    zipCode: 35740,
    companyName: 'Cristal Bâtiment',
  },
  {
    title: 'Assistant(e) juridique',
    description: "Cabinet d'avocats spécialisé en droit des affaires recherche un(e) assistant(e) juridique pour la gestion documentaire, le suivi des procédures et la frappe des actes.",
    cityName: 'Rennes',
    streetNumber: 16,
    streetName: 'Rue de la Chalotais',
    zipCode: 35000,
    companyName: 'Cabinet d\'Avocats Duchesse Anne',
  },
];

export default class JobSeeder {
  async run(dataSource: DataSource, jobsService: JobsService) {
 
    const userRepository = dataSource.getRepository(User);
    const jobRepository = dataSource.getRepository(Job);
 
    const admin = await userRepository.findOneBy({ email: 'admin@job-et-bonheur.fr' });
    if (!admin) {
      console.log("Compte administrateur introuvable, seed des offres d'emploi annulé");
      return;
    }
 
    const existingJobsCount = await jobRepository.count();
    if (existingJobsCount > 0) {
      console.log("Des offres d'emploi existent déjà, seed ignoré");
      return;
    }
 
    console.log(`Création de ${RENNES_JOB_OFFERS.length} offres d'emploi`);
 
    let created = 0;
    let failed = 0;
 
    for (const offer of RENNES_JOB_OFFERS) {
      try {
        await jobsService.create(offer, admin.id);
        created++;
      } catch (error) {
        failed++;
        console.log(
          `Échec de création pour "${offer.title}" à ${offer.cityName} :`,
          error instanceof Error ? error.message : error,
        );
      }
    }
 
    console.log(`Offres créées : ${created}, échecs : ${failed}`);
  }
}
