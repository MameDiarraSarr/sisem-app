--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: affectations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affectations (
    id bigint NOT NULL,
    medecin_id bigint NOT NULL,
    pavillon_id bigint NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    statut character varying(255) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT affectations_statut_check CHECK (((statut)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.affectations OWNER TO postgres;

--
-- Name: affectations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affectations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.affectations_id_seq OWNER TO postgres;

--
-- Name: affectations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affectations_id_seq OWNED BY public.affectations.id;


--
-- Name: analyse_references; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analyse_references (
    id bigint NOT NULL,
    examen_id bigint NOT NULL,
    nom_analyse character varying(255) NOT NULL,
    valeur_normale character varying(255) NOT NULL,
    unite character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.analyse_references OWNER TO postgres;

--
-- Name: analyse_references_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analyse_references_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analyse_references_id_seq OWNER TO postgres;

--
-- Name: analyse_references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analyse_references_id_seq OWNED BY public.analyse_references.id;


--
-- Name: bulletin_examens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bulletin_examens (
    id bigint NOT NULL,
    numero_labo character varying(255) NOT NULL,
    patient_id bigint NOT NULL,
    pavillon_id bigint,
    medecin_id bigint,
    indication_examen text NOT NULL,
    traitement_en_cours character varying(255),
    date_enregistrement date NOT NULL,
    statut character varying(255) DEFAULT 'enregistre'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    imprime_le timestamp(0) without time zone,
    nombre_impressions integer DEFAULT 0 NOT NULL,
    CONSTRAINT bulletin_examens_statut_check CHECK (((statut)::text = ANY ((ARRAY['enregistre'::character varying, 'saisi'::character varying, 'valide'::character varying])::text[])))
);


ALTER TABLE public.bulletin_examens OWNER TO postgres;

--
-- Name: bulletin_examens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bulletin_examens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bulletin_examens_id_seq OWNER TO postgres;

--
-- Name: bulletin_examens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bulletin_examens_id_seq OWNED BY public.bulletin_examens.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache OWNER TO postgres;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO postgres;

--
-- Name: examen_demandes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examen_demandes (
    id bigint NOT NULL,
    bulletin_examen_id bigint NOT NULL,
    examen_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.examen_demandes OWNER TO postgres;

--
-- Name: examen_demandes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.examen_demandes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examen_demandes_id_seq OWNER TO postgres;

--
-- Name: examen_demandes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examen_demandes_id_seq OWNED BY public.examen_demandes.id;


--
-- Name: examens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examens (
    id bigint NOT NULL,
    nom_examen character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.examens OWNER TO postgres;

--
-- Name: examens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.examens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examens_id_seq OWNER TO postgres;

--
-- Name: examens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examens_id_seq OWNED BY public.examens.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: hospitalisations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitalisations (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    pavillon_id bigint NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.hospitalisations OWNER TO postgres;

--
-- Name: hospitalisations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospitalisations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospitalisations_id_seq OWNER TO postgres;

--
-- Name: hospitalisations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospitalisations_id_seq OWNED BY public.hospitalisations.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO postgres;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: medecins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medecins (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    specialite character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.medecins OWNER TO postgres;

--
-- Name: medecins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medecins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medecins_id_seq OWNER TO postgres;

--
-- Name: medecins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medecins_id_seq OWNED BY public.medecins.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    patient_id bigint,
    bulletin_examen_id bigint,
    message character varying(255) NOT NULL,
    lien character varying(255),
    lu boolean DEFAULT false NOT NULL,
    envoye boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    user_id bigint
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id bigint NOT NULL,
    numero_dossier character varying(255),
    prenom character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    date_naissance date,
    sexe character varying(255),
    telephone character varying(255) NOT NULL,
    email character varying(255),
    adresse character varying(255),
    ville character varying(255),
    mot_de_passe character varying(255) NOT NULL,
    type_patient character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    mot_de_passe_temporaire boolean DEFAULT true NOT NULL,
    CONSTRAINT patients_sexe_check CHECK (((sexe)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying])::text[]))),
    CONSTRAINT patients_type_patient_check CHECK (((type_patient)::text = ANY ((ARRAY['interne'::character varying, 'externe'::character varying])::text[])))
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: pavillons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pavillons (
    id bigint NOT NULL,
    nom character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.pavillons OWNER TO postgres;

--
-- Name: pavillons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pavillons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pavillons_id_seq OWNER TO postgres;

--
-- Name: pavillons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pavillons_id_seq OWNED BY public.pavillons.id;


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: resultats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultats (
    id bigint NOT NULL,
    examen_demande_id bigint NOT NULL,
    analyse_reference_id bigint NOT NULL,
    valeur_resultat character varying(255) NOT NULL,
    date_resultat date NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.resultats OWNER TO postgres;

--
-- Name: resultats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resultats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultats_id_seq OWNER TO postgres;

--
-- Name: resultats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resultats_id_seq OWNED BY public.resultats.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    matricule character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    date_naissance date,
    sexe character varying(255),
    telephone character varying(255),
    email character varying(255) NOT NULL,
    adresse character varying(255),
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    statut character varying(255) DEFAULT 'actif'::character varying NOT NULL,
    pavillon_id bigint,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    mot_de_passe_temporaire boolean DEFAULT true NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'secretaire'::character varying, 'technicien'::character varying, 'biologiste'::character varying, 'medecin'::character varying, 'major'::character varying])::text[]))),
    CONSTRAINT users_sexe_check CHECK (((sexe)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying])::text[]))),
    CONSTRAINT users_statut_check CHECK (((statut)::text = ANY ((ARRAY['actif'::character varying, 'inactif'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: affectations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affectations ALTER COLUMN id SET DEFAULT nextval('public.affectations_id_seq'::regclass);


--
-- Name: analyse_references id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analyse_references ALTER COLUMN id SET DEFAULT nextval('public.analyse_references_id_seq'::regclass);


--
-- Name: bulletin_examens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bulletin_examens ALTER COLUMN id SET DEFAULT nextval('public.bulletin_examens_id_seq'::regclass);


--
-- Name: examen_demandes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_demandes ALTER COLUMN id SET DEFAULT nextval('public.examen_demandes_id_seq'::regclass);


--
-- Name: examens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examens ALTER COLUMN id SET DEFAULT nextval('public.examens_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: hospitalisations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitalisations ALTER COLUMN id SET DEFAULT nextval('public.hospitalisations_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: medecins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medecins ALTER COLUMN id SET DEFAULT nextval('public.medecins_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: pavillons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pavillons ALTER COLUMN id SET DEFAULT nextval('public.pavillons_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: resultats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultats ALTER COLUMN id SET DEFAULT nextval('public.resultats_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: affectations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.affectations (id, medecin_id, pavillon_id, date_debut, date_fin, statut, created_at, updated_at) FROM stdin;
2	2	5	2026-07-25	\N	active	2026-07-25 15:00:36	2026-07-25 15:00:36
1	1	1	2026-07-25	\N	active	2026-07-25 15:00:36	2026-07-25 15:14:26
3	1	4	2026-07-25	\N	active	2026-07-25 20:44:54	2026-07-25 20:44:54
4	1	2	2026-07-25	\N	active	2026-07-25 20:45:21	2026-07-25 20:45:21
\.


--
-- Data for Name: analyse_references; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analyse_references (id, examen_id, nom_analyse, valeur_normale, unite, created_at, updated_at) FROM stdin;
1	1	Hémoglobine	12 - 16	g/dL	2026-07-25 15:00:34	2026-07-25 15:00:34
2	1	Globules blancs	4000 - 10000	/mm³	2026-07-25 15:00:34	2026-07-25 15:00:34
3	1	Plaquettes	150000 - 400000	/mm³	2026-07-25 15:00:34	2026-07-25 15:00:34
4	1	Hématocrite	37 - 47	%	2026-07-25 15:00:34	2026-07-25 15:00:34
5	2	Glucose à jeun	0.70 - 1.10	g/L	2026-07-25 15:00:34	2026-07-25 15:00:34
6	3	Créatinine	6 - 12	mg/L	2026-07-25 15:00:34	2026-07-25 15:00:34
7	3	Urée	0.15 - 0.45	g/L	2026-07-25 15:00:34	2026-07-25 15:00:34
8	4	Sodium (Na+)	135 - 145	mmol/L	2026-07-25 15:00:34	2026-07-25 15:00:34
9	4	Potassium (K+)	3.5 - 5.0	mmol/L	2026-07-25 15:00:34	2026-07-25 15:00:34
10	4	Chlore (Cl-)	98 - 107	mmol/L	2026-07-25 15:00:34	2026-07-25 15:00:34
11	5	Protéine C-réactive	0 - 6	mg/L	2026-07-25 15:00:34	2026-07-25 15:00:34
12	6	Résultat sérologique	Négatif	\N	2026-07-25 15:00:34	2026-07-25 15:00:34
\.


--
-- Data for Name: bulletin_examens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bulletin_examens (id, numero_labo, patient_id, pavillon_id, medecin_id, indication_examen, traitement_en_cours, date_enregistrement, statut, created_at, updated_at, imprime_le, nombre_impressions) FROM stdin;
1	11/25/07/2026	3	4	1	bilan de control	Dérapanocytose	2026-07-25	valide	2026-07-25 20:35:56	2026-07-25 20:40:57	\N	0
3	2/26/07/2026	6	10	1	CONROL	PALIDISME	2026-07-26	enregistre	2026-07-26 12:48:43	2026-07-26 12:48:43	\N	0
2	10/25/07/2026	4	2	2	je sais pas	\N	2026-07-25	valide	2026-07-25 20:38:21	2026-07-26 23:17:40	2026-07-26 23:17:40	6
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: examen_demandes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examen_demandes (id, bulletin_examen_id, examen_id, created_at, updated_at) FROM stdin;
1	1	2	2026-07-25 20:35:56	2026-07-25 20:35:56
2	1	1	2026-07-25 20:35:56	2026-07-25 20:35:56
3	2	5	2026-07-25 20:38:21	2026-07-25 20:38:21
4	2	4	2026-07-25 20:38:21	2026-07-25 20:38:21
5	3	1	2026-07-26 12:48:43	2026-07-26 12:48:43
\.


--
-- Data for Name: examens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examens (id, nom_examen, created_at, updated_at) FROM stdin;
1	Hémogramme	2026-07-25 15:00:33	2026-07-25 15:00:33
2	Glycémie	2026-07-25 15:00:34	2026-07-25 15:00:34
3	Bilan rénal	2026-07-25 15:00:34	2026-07-25 15:00:34
4	Ionogramme	2026-07-25 15:00:34	2026-07-25 15:00:34
5	CRP	2026-07-25 15:00:34	2026-07-25 15:00:34
6	Sérologie	2026-07-25 15:00:34	2026-07-25 15:00:34
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: hospitalisations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospitalisations (id, patient_id, pavillon_id, date_debut, date_fin, created_at, updated_at) FROM stdin;
1	1	1	2026-07-25	\N	2026-07-25 15:00:36	2026-07-25 15:00:36
2	3	4	2026-07-25	\N	2026-07-25 20:34:25	2026-07-25 20:34:25
3	4	2	2026-07-25	\N	2026-07-25 20:37:11	2026-07-25 20:37:11
4	6	10	2026-07-26	\N	2026-07-26 12:47:42	2026-07-26 12:47:42
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: medecins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medecins (id, user_id, specialite, created_at, updated_at) FROM stdin;
1	6	Pédiatrie	2026-07-25 15:00:36	2026-07-25 15:00:36
2	7	Néphrologie	2026-07-25 15:00:36	2026-07-25 15:00:36
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000001_create_cache_table	1
2	0001_01_01_000002_create_jobs_table	1
3	2026_07_09_205950_create_pavillons_table	1
4	2026_07_09_210005_create_users_table	1
5	2026_07_09_210013_create_examens_table	1
6	2026_07_09_210024_create_analyse_references_table	1
7	2026_07_09_210033_create_patients_table	1
8	2026_07_09_210041_create_medecins_table	1
9	2026_07_09_210050_create_affectations_table	1
10	2026_07_09_210104_create_bulletin_examens_table	1
11	2026_07_09_210114_create_examen_demandes_table	1
12	2026_07_09_210121_create_resultats_table	1
13	2026_07_09_225520_create_personal_access_tokens_table	1
14	2026_07_10_193648_create_notifications_table	1
15	2026_07_18_162102_create_hospitalisations_table	1
16	2026_07_18_170154_add_mot_de_passe_temporaire	1
17	2026_07_19_181537_add_user_id_to_notifications	1
18	2026_07_26_221705_add_imprime_le_to_bulletin_examens	2
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, patient_id, bulletin_examen_id, message, lien, lu, envoye, created_at, updated_at, user_id) FROM stdin;
1	4	2	Bonjour Abdou, vos résultats du 25/07/2026 sont disponibles sur SISEM.	http://localhost:4201/connexion	f	f	2026-07-25 20:40:49	2026-07-25 20:40:49	\N
2	\N	2	Les résultats du bulletin 10/25/07/2026 (Abdou Fall) ont été validés.	\N	f	f	2026-07-25 20:40:49	2026-07-25 20:40:49	2
3	\N	2	Les résultats du bulletin 10/25/07/2026 (Abdou Fall) ont été validés.	\N	f	f	2026-07-25 20:40:49	2026-07-25 20:40:49	7
5	\N	1	Les résultats du bulletin 11/25/07/2026 (Diarra Sarr) ont été validés.	\N	f	f	2026-07-25 20:40:57	2026-07-25 20:40:57	2
6	\N	1	Les résultats du bulletin 11/25/07/2026 (Diarra Sarr) ont été validés.	\N	f	f	2026-07-25 20:40:57	2026-07-25 20:40:57	6
4	3	1	Bonjour Diarra, vos résultats du 25/07/2026 sont disponibles sur SISEM.	http://localhost:4201/connexion	f	t	2026-07-25 20:40:57	2026-07-25 20:41:16	\N
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, numero_dossier, prenom, nom, date_naissance, sexe, telephone, email, adresse, ville, mot_de_passe, type_patient, created_at, updated_at, mot_de_passe_temporaire) FROM stdin;
1	DOS-0001	Amadou	Diop	2018-03-12	M	771234567	\N	Sicap Liberté 6	Dakar	$2y$12$4YpLqQWnLd1OdPYc6SLjJewOWJJRJ/g/9OEWzUfxdKOfI8lCP8p92	interne	2026-07-25 15:00:36	2026-07-25 15:00:36	t
2	\N	Fatou	Ndiaye	2021-07-04	F	772345678	\N	Grand Yoff	Dakar	$2y$12$LyThC4EzKdU4ZVCZUVMAbOu6W2GeBASwdQiGXioE5WRca.g2JijLe	externe	2026-07-25 15:00:37	2026-07-25 15:00:37	t
3	DOS-0002	Diarra	Sarr	\N	\N	781269726	sarrdiarrafaty@gmail.com	Ouakam	Dakar	$2y$12$tYeHuYqWHmMUCR5tjU2qYuXBS4wuRylnl5C6RafQQPMQ35fV1D/P6	interne	2026-07-25 20:34:25	2026-07-25 20:34:25	t
4	DOS-0003	Abdou	Fall	2026-06-19	M	7723455991	\N	Ouakam	Dakar	$2y$12$/DXsFFA1KkhYCHnhkgwWWOJCRdXtsJ0Jo90IC96SP9vjyO3UqbakK	interne	2026-07-25 20:37:11	2026-07-25 20:37:11	t
6	DOS-0004	Amy	Sarr	2026-06-26	F	78282929292	sarr@gmail.com	Ouakam	Dakar	$2y$12$I.n2/MDcKZZzsyQeai3/fum8ajYg4SdHzuQXC1l4U99kPNi8EqxNq	interne	2026-07-26 12:47:42	2026-07-26 12:47:42	t
5	\N	khadim	fall	2026-07-05	M	7723455994	fall@gmail.com	rr	rr	$2y$12$dcxE/U7GV71cDnf6D1Cu2eyOeJxtpiLsa4ArcxXe5KRCCtHfufkb6	externe	2026-07-25 21:31:11	2026-08-05 08:11:08	t
\.


--
-- Data for Name: pavillons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pavillons (id, nom, created_at, updated_at) FROM stdin;
1	Pavillon M	2026-07-25 15:00:33	2026-07-25 15:00:33
2	Pavillon N	2026-07-25 15:00:33	2026-07-25 15:00:33
3	Pavillon O	2026-07-25 15:00:33	2026-07-25 15:00:33
4	Pavillon K	2026-07-25 15:00:33	2026-07-25 15:00:33
5	USAD	2026-07-25 15:00:33	2026-07-25 15:00:33
6	SAU	2026-07-25 15:00:33	2026-07-25 15:00:33
7	Dermatologie	2026-07-25 15:00:33	2026-07-25 15:00:33
8	Esther	2026-07-25 15:00:33	2026-07-25 15:00:33
9	Chirurgie	2026-07-25 15:00:33	2026-07-25 15:00:33
10	Chirurgie Pédiatrique	2026-07-25 15:00:33	2026-07-25 15:00:33
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
2	App\\Models\\User	6	personnel	6035ff2aa79deb865e44158450b745bc12efa7ba43022eac0d8957ce22694206	["*"]	\N	\N	2026-07-25 15:07:45	2026-07-25 15:07:45
1	App\\Models\\User	5	personnel	752cd47ef389d55c1ceb69f55e7dbe073a43e6b7545ba1eacbac3db06dbf380d	["*"]	2026-07-25 15:07:58	\N	2026-07-25 15:06:39	2026-07-25 15:07:58
33	App\\Models\\User	2	personnel	e63e6e521c12c92d753a08172274fabaf201c6c82d7084420b35e9649d0e4ba1	["*"]	2026-07-26 14:36:41	\N	2026-07-25 23:17:35	2026-07-26 14:36:41
40	App\\Models\\User	2	personnel	d1404682d65123db64aa5696f73fd6c131e351c49a3bd4e9eb049b142437c926	["*"]	2026-08-05 07:19:14	\N	2026-08-05 07:17:42	2026-08-05 07:19:14
34	App\\Models\\User	2	personnel	74e342541b69dc85ec6fc90742cb3ecd7365d2035a6145875571f6d9eed3bf72	["*"]	2026-07-26 14:39:30	\N	2026-07-26 14:37:06	2026-07-26 14:39:30
41	App\\Models\\User	2	personnel	c6fde4e27ef167ec04328d1e77568c869eba42abae1f0abe4401b9bf01b1e117	["*"]	2026-08-06 01:02:32	\N	2026-08-05 07:19:29	2026-08-06 01:02:32
42	App\\Models\\Patient	6	patient	bfbf72d555b84253c337bb97ad77611187dfbb6faf8fd5659683257922eb0d7c	["*"]	\N	\N	2026-08-06 08:53:33	2026-08-06 08:53:33
44	App\\Models\\Patient	3	patient	bc1f16fa1eca42143ebd9d1f517e3c032774ce97eacc2137e867c6220665772c	["*"]	2026-08-06 09:38:05	\N	2026-08-06 09:38:05	2026-08-06 09:38:05
38	App\\Models\\User	2	personnel	d16c0e86ddc8d1d048a34417d3b1ef6b4e6781b9623a986131422bbd9879af09	["*"]	2026-08-04 23:44:57	\N	2026-08-04 23:37:28	2026-08-04 23:44:57
45	App\\Models\\Patient	3	patient	4623024d50a0c32f7ed94ddbf18f4cb76fd19fb68772c57c863094d6434763d9	["*"]	2026-08-06 10:55:12	\N	2026-08-06 10:55:11	2026-08-06 10:55:12
37	App\\Models\\User	2	personnel	108d67bc28ed01589117989278db0a0ee138477a0f57016818ee2a4faf8407e9	["*"]	2026-08-03 13:11:31	\N	2026-08-03 07:32:34	2026-08-03 13:11:31
46	App\\Models\\Patient	3	patient	bae0d89fabcd6eaa86bac49b623dad09f06174e74496200bb18463577f2872b9	["*"]	2026-08-06 11:00:50	\N	2026-08-06 11:00:49	2026-08-06 11:00:50
36	App\\Models\\User	2	personnel	937797b71fc79cdc99a23a9483ec39c8449a042a8ee490a365f5c1a13ecbc5e1	["*"]	2026-08-03 07:32:21	\N	2026-07-26 23:40:48	2026-08-03 07:32:21
47	App\\Models\\Patient	3	patient	0abb976556312b8ad35ad3a954c34ef4083c511f341122cb8d0355d6aa9b0f9b	["*"]	2026-08-06 12:20:30	\N	2026-08-06 12:20:30	2026-08-06 12:20:30
39	App\\Models\\User	2	personnel	6d4b0e0c5f80b545a276110da833a1cfa6fc5e06d916abd99d85bab706f4ae43	["*"]	2026-08-05 07:16:18	\N	2026-08-04 23:45:06	2026-08-05 07:16:18
35	App\\Models\\User	2	personnel	2837be99f82ecdbd01b7eb13a0c2970ce4d5463a35d2fb752475bad3f1dd6b77	["*"]	2026-07-26 23:26:13	\N	2026-07-26 14:39:45	2026-07-26 23:26:13
26	App\\Models\\User	6	personnel	502a9185588282de6466fac2a79f3105f04f4dac726ac9243428d9160a31ea0b	["*"]	2026-07-25 21:38:00	\N	2026-07-25 21:37:12	2026-07-25 21:38:00
\.


--
-- Data for Name: resultats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resultats (id, examen_demande_id, analyse_reference_id, valeur_resultat, date_resultat, created_at, updated_at) FROM stdin;
1	3	11	5	2026-07-25	2026-07-25 20:39:18	2026-07-25 20:39:18
2	4	8	140	2026-07-25	2026-07-25 20:39:18	2026-07-25 20:39:18
3	4	9	3.5	2026-07-25	2026-07-25 20:39:18	2026-07-25 20:39:18
4	4	10	100	2026-07-25	2026-07-25 20:39:18	2026-07-25 20:39:18
5	1	5	1.3	2026-07-25	2026-07-25 20:40:16	2026-07-25 20:40:16
6	2	1	14	2026-07-25	2026-07-25 20:40:16	2026-07-25 20:40:16
7	2	2	4000	2026-07-25	2026-07-25 20:40:16	2026-07-25 20:40:16
8	2	3	300000	2026-07-25	2026-07-25 20:40:16	2026-07-25 20:40:16
9	2	4	42	2026-07-25	2026-07-25 20:40:16	2026-07-25 20:40:16
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, matricule, prenom, nom, date_naissance, sexe, telephone, email, adresse, email_verified_at, password, role, statut, pavillon_id, remember_token, created_at, updated_at, mot_de_passe_temporaire) FROM stdin;
1	ADM-001	Awa	Diop	\N	\N	770000001	admin@albertroyer.sn	\N	\N	$2y$12$SaKQoranADgDLsqUCfnT9.O43QhEfQFAZMeaH20PD/Brpsf6Kcg/i	admin	actif	\N	\N	2026-07-25 15:00:35	2026-07-25 15:00:35	t
3	TEC-001	Ousmane	Sow	\N	\N	770000003	technicien@albertroyer.sn	\N	\N	$2y$12$eSxWcKvH.YMMCuz0rhYe4uenLi0x.Fnxu8gSTr4U7TwgcZjgeiVzq	technicien	actif	\N	\N	2026-07-25 15:00:35	2026-07-25 15:00:35	t
5	MAJ-001	Awa	Sène	\N	\N	770000005	major@albertroyer.sn	\N	\N	$2y$12$NiJPWj5f3vQcVpv4gJghee1YSA6owPwDNKYOPZJq4GNfEw4i42Vuy	major	actif	1	\N	2026-07-25 15:00:35	2026-07-25 15:00:35	t
6	MED-001	Aliou	Ndiaye	\N	\N	770000006	aliou.ndiaye@albertroyer.sn	\N	\N	$2y$12$93lWGZGKu95niNhwvTriY.6J32rKaBySbVjedXGnvwDEMLU951PIe	medecin	actif	\N	\N	2026-07-25 15:00:36	2026-07-25 15:00:36	t
7	MED-002	Mariama	Ndiaye	\N	\N	770000007	mariama.ndiaye@albertroyer.sn	\N	\N	$2y$12$gPWWQgMH4X.CBuAWE4PVneNUfFgFIGBCbXIpcA1j/7fZTBdj7WFrK	medecin	actif	\N	\N	2026-07-25 15:00:36	2026-07-25 15:00:36	t
8	MAJ-002	khadim	dia	\N	\N	7723455992	majork@gmail.com	\N	\N	$2y$12$4Giub/dE.gfasfmgWZogZOej9U2h/ldYE594c2fUcJSXFwqKIOnZq	major	actif	4	\N	2026-07-25 20:43:26	2026-07-25 20:43:26	t
2	SEC-001	Marième	Fall	\N	\N	770000003	secretaire@albertroyer.sn	Medina	\N	$2y$12$A4h5y7L/8ZQBBxeWYO5fT.bXgOCaZt92WapdVN19leerGFDXb419m	secretaire	actif	\N	\N	2026-07-25 15:00:35	2026-07-25 22:50:41	t
4	BIO-001	Fatou	Diallo	\N	\N	770000004	biologiste@albertroyer.sn	Médina	\N	$2y$12$1a/9et0pzTIsi.mKX4Y01.0jTtgqxzMcGNzhY9xi2eyVQao/fH6aS	biologiste	actif	\N	\N	2026-07-25 15:00:35	2026-07-25 22:59:35	t
\.


--
-- Name: affectations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.affectations_id_seq', 4, true);


--
-- Name: analyse_references_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analyse_references_id_seq', 12, true);


--
-- Name: bulletin_examens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bulletin_examens_id_seq', 3, true);


--
-- Name: examen_demandes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examen_demandes_id_seq', 5, true);


--
-- Name: examens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examens_id_seq', 6, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: hospitalisations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospitalisations_id_seq', 4, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 2, true);


--
-- Name: medecins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medecins_id_seq', 2, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 18, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 6, true);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 6, true);


--
-- Name: pavillons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pavillons_id_seq', 10, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 47, true);


--
-- Name: resultats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resultats_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: affectations affectations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affectations
    ADD CONSTRAINT affectations_pkey PRIMARY KEY (id);


--
-- Name: analyse_references analyse_references_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analyse_references
    ADD CONSTRAINT analyse_references_pkey PRIMARY KEY (id);


--
-- Name: bulletin_examens bulletin_examens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bulletin_examens
    ADD CONSTRAINT bulletin_examens_pkey PRIMARY KEY (id);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: examen_demandes examen_demandes_bulletin_examen_id_examen_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_demandes
    ADD CONSTRAINT examen_demandes_bulletin_examen_id_examen_id_unique UNIQUE (bulletin_examen_id, examen_id);


--
-- Name: examen_demandes examen_demandes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_demandes
    ADD CONSTRAINT examen_demandes_pkey PRIMARY KEY (id);


--
-- Name: examens examens_nom_examen_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examens
    ADD CONSTRAINT examens_nom_examen_unique UNIQUE (nom_examen);


--
-- Name: examens examens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examens
    ADD CONSTRAINT examens_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: hospitalisations hospitalisations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitalisations
    ADD CONSTRAINT hospitalisations_pkey PRIMARY KEY (id);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: medecins medecins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medecins
    ADD CONSTRAINT medecins_pkey PRIMARY KEY (id);


--
-- Name: medecins medecins_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medecins
    ADD CONSTRAINT medecins_user_id_unique UNIQUE (user_id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: patients patients_numero_dossier_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_numero_dossier_unique UNIQUE (numero_dossier);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: patients patients_telephone_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_telephone_unique UNIQUE (telephone);


--
-- Name: pavillons pavillons_nom_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pavillons
    ADD CONSTRAINT pavillons_nom_unique UNIQUE (nom);


--
-- Name: pavillons pavillons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pavillons
    ADD CONSTRAINT pavillons_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: resultats resultats_examen_demande_id_analyse_reference_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultats
    ADD CONSTRAINT resultats_examen_demande_id_analyse_reference_id_unique UNIQUE (examen_demande_id, analyse_reference_id);


--
-- Name: resultats resultats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultats
    ADD CONSTRAINT resultats_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_matricule_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_matricule_unique UNIQUE (matricule);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: affectations affectations_medecin_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affectations
    ADD CONSTRAINT affectations_medecin_id_foreign FOREIGN KEY (medecin_id) REFERENCES public.medecins(id) ON DELETE CASCADE;


--
-- Name: affectations affectations_pavillon_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affectations
    ADD CONSTRAINT affectations_pavillon_id_foreign FOREIGN KEY (pavillon_id) REFERENCES public.pavillons(id) ON DELETE CASCADE;


--
-- Name: analyse_references analyse_references_examen_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analyse_references
    ADD CONSTRAINT analyse_references_examen_id_foreign FOREIGN KEY (examen_id) REFERENCES public.examens(id) ON DELETE CASCADE;


--
-- Name: bulletin_examens bulletin_examens_medecin_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bulletin_examens
    ADD CONSTRAINT bulletin_examens_medecin_id_foreign FOREIGN KEY (medecin_id) REFERENCES public.medecins(id) ON DELETE SET NULL;


--
-- Name: bulletin_examens bulletin_examens_patient_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bulletin_examens
    ADD CONSTRAINT bulletin_examens_patient_id_foreign FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: bulletin_examens bulletin_examens_pavillon_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bulletin_examens
    ADD CONSTRAINT bulletin_examens_pavillon_id_foreign FOREIGN KEY (pavillon_id) REFERENCES public.pavillons(id) ON DELETE SET NULL;


--
-- Name: examen_demandes examen_demandes_bulletin_examen_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_demandes
    ADD CONSTRAINT examen_demandes_bulletin_examen_id_foreign FOREIGN KEY (bulletin_examen_id) REFERENCES public.bulletin_examens(id) ON DELETE CASCADE;


--
-- Name: examen_demandes examen_demandes_examen_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_demandes
    ADD CONSTRAINT examen_demandes_examen_id_foreign FOREIGN KEY (examen_id) REFERENCES public.examens(id) ON DELETE RESTRICT;


--
-- Name: hospitalisations hospitalisations_patient_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitalisations
    ADD CONSTRAINT hospitalisations_patient_id_foreign FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: hospitalisations hospitalisations_pavillon_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitalisations
    ADD CONSTRAINT hospitalisations_pavillon_id_foreign FOREIGN KEY (pavillon_id) REFERENCES public.pavillons(id) ON DELETE CASCADE;


--
-- Name: medecins medecins_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medecins
    ADD CONSTRAINT medecins_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_bulletin_examen_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_bulletin_examen_id_foreign FOREIGN KEY (bulletin_examen_id) REFERENCES public.bulletin_examens(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_patient_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_patient_id_foreign FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: resultats resultats_analyse_reference_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultats
    ADD CONSTRAINT resultats_analyse_reference_id_foreign FOREIGN KEY (analyse_reference_id) REFERENCES public.analyse_references(id) ON DELETE RESTRICT;


--
-- Name: resultats resultats_examen_demande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultats
    ADD CONSTRAINT resultats_examen_demande_id_foreign FOREIGN KEY (examen_demande_id) REFERENCES public.examen_demandes(id) ON DELETE CASCADE;


--
-- Name: users users_pavillon_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pavillon_id_foreign FOREIGN KEY (pavillon_id) REFERENCES public.pavillons(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

