-- CreateTable
CREATE TABLE "dermasight"."Prediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "predicted_class" TEXT NOT NULL,
    "severity_label" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "combined_score" DOUBLE PRECISION NOT NULL,
    "malignancy_score" DOUBLE PRECISION NOT NULL,
    "site_risk_score" DOUBLE PRECISION NOT NULL,
    "area_pct" DOUBLE PRECISION NOT NULL,
    "inference_time_ms" DOUBLE PRECISION NOT NULL,
    "anatomical_site" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dermasight"."Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "dermasight"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
