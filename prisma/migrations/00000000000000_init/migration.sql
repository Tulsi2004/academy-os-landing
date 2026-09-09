-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "isReturning" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "timezone" TEXT,
    "language" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "deviceType" TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "totalDuration" INTEGER,
    "isBounce" BOOLEAN NOT NULL DEFAULT true,
    "pagesViewed" INTEGER NOT NULL DEFAULT 0,
    "entryPath" TEXT,
    "exitPath" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "gclid" TEXT,
    "fbclid" TEXT,
    "msclkid" TEXT,
    "ipAddress" TEXT,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitedAt" TIMESTAMP(3),
    "timeOnPage" INTEGER,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrollEvent" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "timeToReach" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrollEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CtaEvent" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "ctaId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timeBeforeClick" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CtaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormEvent" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fieldName" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorEvent" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "path" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "visitorId" TEXT,
    "sessionId" TEXT,
    "formId" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "company" TEXT,
    "interest" TEXT,
    "message" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MouseEvent" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "targetSelector" TEXT,
    "hoverDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MouseEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeatmapEvent" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "xPct" DOUBLE PRECISION NOT NULL,
    "yPct" DOUBLE PRECISION NOT NULL,
    "viewportWidth" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeatmapEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionReplay" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "eventCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionReplay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visitor_site_firstSeenAt_idx" ON "Visitor"("site", "firstSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_site_fingerprint_key" ON "Visitor"("site", "fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "Session_clientId_key" ON "Session"("clientId");

-- CreateIndex
CREATE INDEX "Session_visitorId_idx" ON "Session"("visitorId");

-- CreateIndex
CREATE INDEX "Session_site_startedAt_idx" ON "Session"("site", "startedAt");

-- CreateIndex
CREATE INDEX "Session_site_utmSource_utmMedium_utmCampaign_idx" ON "Session"("site", "utmSource", "utmMedium", "utmCampaign");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "PageView_site_path_idx" ON "PageView"("site", "path");

-- CreateIndex
CREATE INDEX "PageView_site_enteredAt_idx" ON "PageView"("site", "enteredAt");

-- CreateIndex
CREATE INDEX "Event_sessionId_idx" ON "Event"("sessionId");

-- CreateIndex
CREATE INDEX "Event_site_name_idx" ON "Event"("site", "name");

-- CreateIndex
CREATE INDEX "ScrollEvent_sessionId_idx" ON "ScrollEvent"("sessionId");

-- CreateIndex
CREATE INDEX "ScrollEvent_site_path_depth_idx" ON "ScrollEvent"("site", "path", "depth");

-- CreateIndex
CREATE INDEX "ScrollEvent_site_createdAt_idx" ON "ScrollEvent"("site", "createdAt");

-- CreateIndex
CREATE INDEX "CtaEvent_sessionId_idx" ON "CtaEvent"("sessionId");

-- CreateIndex
CREATE INDEX "CtaEvent_site_ctaId_action_idx" ON "CtaEvent"("site", "ctaId", "action");

-- CreateIndex
CREATE INDEX "CtaEvent_site_createdAt_idx" ON "CtaEvent"("site", "createdAt");

-- CreateIndex
CREATE INDEX "FormEvent_sessionId_idx" ON "FormEvent"("sessionId");

-- CreateIndex
CREATE INDEX "FormEvent_site_formId_action_idx" ON "FormEvent"("site", "formId", "action");

-- CreateIndex
CREATE INDEX "FormEvent_site_createdAt_idx" ON "FormEvent"("site", "createdAt");

-- CreateIndex
CREATE INDEX "PerformanceMetric_sessionId_idx" ON "PerformanceMetric"("sessionId");

-- CreateIndex
CREATE INDEX "PerformanceMetric_site_path_metric_idx" ON "PerformanceMetric"("site", "path", "metric");

-- CreateIndex
CREATE INDEX "PerformanceMetric_site_createdAt_idx" ON "PerformanceMetric"("site", "createdAt");

-- CreateIndex
CREATE INDEX "ErrorEvent_sessionId_idx" ON "ErrorEvent"("sessionId");

-- CreateIndex
CREATE INDEX "ErrorEvent_site_type_createdAt_idx" ON "ErrorEvent"("site", "type", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_site_createdAt_idx" ON "Lead"("site", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_site_status_idx" ON "Lead"("site", "status");

-- CreateIndex
CREATE INDEX "MouseEvent_sessionId_idx" ON "MouseEvent"("sessionId");

-- CreateIndex
CREATE INDEX "MouseEvent_site_path_type_idx" ON "MouseEvent"("site", "path", "type");

-- CreateIndex
CREATE INDEX "MouseEvent_site_createdAt_idx" ON "MouseEvent"("site", "createdAt");

-- CreateIndex
CREATE INDEX "HeatmapEvent_sessionId_idx" ON "HeatmapEvent"("sessionId");

-- CreateIndex
CREATE INDEX "HeatmapEvent_site_path_type_idx" ON "HeatmapEvent"("site", "path", "type");

-- CreateIndex
CREATE INDEX "SessionReplay_sessionId_seq_idx" ON "SessionReplay"("sessionId", "seq");

-- CreateIndex
CREATE UNIQUE INDEX "SessionReplay_sessionId_seq_key" ON "SessionReplay"("sessionId", "seq");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrollEvent" ADD CONSTRAINT "ScrollEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtaEvent" ADD CONSTRAINT "CtaEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormEvent" ADD CONSTRAINT "FormEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetric" ADD CONSTRAINT "PerformanceMetric_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorEvent" ADD CONSTRAINT "ErrorEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouseEvent" ADD CONSTRAINT "MouseEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeatmapEvent" ADD CONSTRAINT "HeatmapEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionReplay" ADD CONSTRAINT "SessionReplay_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
