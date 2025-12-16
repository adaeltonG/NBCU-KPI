import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const app = express();
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// CATEGORIES
// ============================================
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { kpis: true } },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ============================================
// SERVICE LINES
// ============================================
app.get('/api/service-lines', async (req, res) => {
  try {
    const serviceLines = await prisma.serviceLine.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(serviceLines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service lines' });
  }
});

// ============================================
// PERIODS
// ============================================
app.get('/api/periods', async (req, res) => {
  try {
    const periods = await prisma.period.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    res.json(periods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch periods' });
  }
});

app.get('/api/periods/:id', async (req, res) => {
  try {
    const period = await prisma.period.findUnique({
      where: { id: req.params.id },
    });
    if (!period) {
      return res.status(404).json({ error: 'Period not found' });
    }
    res.json(period);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch period' });
  }
});

// ============================================
// KPIs
// ============================================
app.get('/api/kpis', async (req, res) => {
  try {
    const { categoryId, serviceLineId } = req.query;
    
    const kpis = await prisma.kPI.findMany({
      where: {
        isActive: true,
        ...(categoryId && { categoryId: categoryId as string }),
        ...(serviceLineId && { serviceLineId: serviceLineId as string }),
      },
      orderBy: { kpiNumber: 'asc' },
      include: {
        category: true,
        serviceLine: true,
        responsiblePerson: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

app.get('/api/kpis/:id', async (req, res) => {
  try {
    const kpi = await prisma.kPI.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        serviceLine: true,
        responsiblePerson: {
          select: { id: true, name: true, email: true },
        },
        scores: {
          include: {
            period: true,
            submittedBy: { select: { id: true, name: true } },
          },
          orderBy: { period: { month: 'asc' } },
        },
        clientScores: {
          include: {
            period: true,
            scoredBy: { select: { id: true, name: true } },
          },
        },
        comments: {
          include: {
            period: true,
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        evidence: {
          include: {
            period: true,
            uploadedBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!kpi) {
      return res.status(404).json({ error: 'KPI not found' });
    }
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPI' });
  }
});

// ============================================
// KPI SCORES
// ============================================
app.get('/api/scores', async (req, res) => {
  try {
    const { periodId, kpiId } = req.query;
    
    const scores = await prisma.kPIScore.findMany({
      where: {
        ...(periodId && { periodId: periodId as string }),
        ...(kpiId && { kpiId: kpiId as string }),
      },
      include: {
        kpi: { select: { id: true, kpiNumber: true, objective: true } },
        period: true,
        submittedBy: { select: { id: true, name: true } },
      },
    });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const { kpiId, periodId, actualValue, numericValue, notes, submittedById } = req.body;
    
    const score = await prisma.kPIScore.upsert({
      where: {
        kpiId_periodId: { kpiId, periodId },
      },
      update: {
        actualValue,
        numericValue,
        score: numericValue ? (numericValue <= 1 ? numericValue : numericValue / 5) : null,
        notes,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        submittedById,
      },
      create: {
        kpiId,
        periodId,
        actualValue,
        numericValue,
        score: numericValue ? (numericValue <= 1 ? numericValue : numericValue / 5) : null,
        notes,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        submittedById,
      },
      include: {
        kpi: true,
        period: true,
      },
    });
    res.json(score);
  } catch (error) {
    console.error('Error creating score:', error);
    res.status(500).json({ error: 'Failed to create score' });
  }
});

// ============================================
// CLIENT SCORES
// ============================================
app.get('/api/client-scores', async (req, res) => {
  try {
    const { periodId, kpiId } = req.query;
    
    const scores = await prisma.clientScore.findMany({
      where: {
        ...(periodId && { periodId: periodId as string }),
        ...(kpiId && { kpiId: kpiId as string }),
      },
      include: {
        kpi: { select: { id: true, kpiNumber: true, objective: true } },
        period: true,
        scoredBy: { select: { id: true, name: true } },
      },
    });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client scores' });
  }
});

app.post('/api/client-scores', async (req, res) => {
  try {
    const { kpiId, periodId, score, justification, scoredById } = req.body;
    
    const clientScore = await prisma.clientScore.upsert({
      where: {
        kpiId_periodId: { kpiId, periodId },
      },
      update: {
        score,
        justification,
        scoredById,
        scoredAt: new Date(),
      },
      create: {
        kpiId,
        periodId,
        score,
        justification,
        scoredById,
      },
      include: {
        kpi: true,
        period: true,
      },
    });
    res.json(clientScore);
  } catch (error) {
    console.error('Error creating client score:', error);
    res.status(500).json({ error: 'Failed to create client score' });
  }
});

// ============================================
// COMMENTS
// ============================================
app.get('/api/comments', async (req, res) => {
  try {
    const { kpiId, periodId } = req.query;
    
    const comments = await prisma.kPIComment.findMany({
      where: {
        ...(kpiId && { kpiId: kpiId as string }),
        ...(periodId && { periodId: periodId as string }),
      },
      include: {
        kpi: { select: { id: true, kpiNumber: true, objective: true } },
        period: true,
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { kpiId, periodId, content, type, authorId } = req.body;
    
    const comment = await prisma.kPIComment.create({
      data: {
        kpiId,
        periodId,
        content,
        type: type || 'GENERAL',
        authorId,
      },
      include: {
        kpi: true,
        period: true,
        author: { select: { id: true, name: true } },
      },
    });
    res.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// ============================================
// EVIDENCE
// ============================================
app.get('/api/evidence', async (req, res) => {
  try {
    const { kpiId, periodId } = req.query;
    
    const evidence = await prisma.kPIEvidence.findMany({
      where: {
        ...(kpiId && { kpiId: kpiId as string }),
        ...(periodId && { periodId: periodId as string }),
      },
      include: {
        kpi: { select: { id: true, kpiNumber: true, objective: true } },
        period: true,
        uploadedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
});

app.post('/api/evidence', async (req, res) => {
  try {
    const { kpiId, periodId, title, description, fileUrl, fileName, fileType, fileSize, type, uploadedById } = req.body;
    
    const evidence = await prisma.kPIEvidence.create({
      data: {
        kpiId,
        periodId,
        title,
        description,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        type: type || 'DOCUMENT',
        uploadedById,
      },
      include: {
        kpi: true,
        period: true,
        uploadedBy: { select: { id: true, name: true } },
      },
    });
    res.json(evidence);
  } catch (error) {
    console.error('Error creating evidence:', error);
    res.status(500).json({ error: 'Failed to create evidence' });
  }
});

// ============================================
// ACTIONS
// ============================================
app.get('/api/actions', async (req, res) => {
  try {
    const { status } = req.query;
    
    const actions = await prisma.action.findMany({
      where: {
        ...(status && { status: status as any }),
      },
      include: {
        responsible: { select: { id: true, name: true } },
      },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
    });
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch actions' });
  }
});

app.post('/api/actions', async (req, res) => {
  try {
    const { description, requiredAction, raisedBy, dueDate, responsibleId } = req.body;
    
    // Get next action number
    const lastAction = await prisma.action.findFirst({
      orderBy: { actionNumber: 'desc' },
    });
    const actionNumber = (lastAction?.actionNumber || 0) + 1;
    
    const action = await prisma.action.create({
      data: {
        actionNumber,
        description,
        requiredAction,
        raisedBy,
        dueDate: dueDate ? new Date(dueDate) : null,
        responsibleId,
      },
      include: {
        responsible: { select: { id: true, name: true } },
      },
    });
    res.json(action);
  } catch (error) {
    console.error('Error creating action:', error);
    res.status(500).json({ error: 'Failed to create action' });
  }
});

app.patch('/api/actions/:id', async (req, res) => {
  try {
    const { status, completedDate } = req.body;
    
    const action = await prisma.action.update({
      where: { id: req.params.id },
      data: {
        status,
        completedDate: completedDate ? new Date(completedDate) : null,
      },
      include: {
        responsible: { select: { id: true, name: true } },
      },
    });
    res.json(action);
  } catch (error) {
    console.error('Error updating action:', error);
    res.status(500).json({ error: 'Failed to update action' });
  }
});

// ============================================
// USERS
// ============================================
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ============================================
// DASHBOARD STATS
// ============================================
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { periodId } = req.query;
    
    // Get all KPIs
    const kpis = await prisma.kPI.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
    });
    
    // Get scores for the period
    const scores = periodId
      ? await prisma.kPIScore.findMany({
          where: { periodId: periodId as string },
        })
      : await prisma.kPIScore.findMany();
    
    // Calculate stats
    let passed = 0;
    let failed = 0;
    let pending = kpis.length - scores.length;
    
    scores.forEach((score) => {
      const val = score.numericValue;
      if (val !== null && val !== undefined) {
        if (val >= 0.9 || val >= 4) {
          passed++;
        } else {
          failed++;
        }
      } else {
        pending++;
      }
    });
    
    // Calculate overall average
    const scoredItems = scores.filter((s) => s.numericValue !== null);
    const overallScore =
      scoredItems.length > 0
        ? scoredItems.reduce((sum, s) => {
            const val = s.numericValue!;
            return sum + (val <= 1 ? val : val / 5);
          }, 0) / scoredItems.length
        : 0;
    
    // Calculate category scores
    const categoryScores = await Promise.all(
      (await prisma.category.findMany()).map(async (cat) => {
        const catKpis = kpis.filter((k) => k.categoryId === cat.id);
        const catScores = scores.filter((s) =>
          catKpis.some((k) => k.id === s.kpiId)
        );
        const catScored = catScores.filter((s) => s.numericValue !== null);
        const avgScore =
          catScored.length > 0
            ? catScored.reduce((sum, s) => {
                const val = s.numericValue!;
                return sum + (val <= 1 ? val : val / 5);
              }, 0) / catScored.length
            : 0;
        
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          categoryShortName: cat.shortName,
          categoryColor: cat.color,
          score: avgScore * 100,
          kpiCount: catKpis.length,
          passedCount: catScores.filter(
            (s) => s.numericValue !== null && (s.numericValue >= 0.9 || s.numericValue >= 4)
          ).length,
        };
      })
    );
    
    res.json({
      totalKPIs: kpis.length,
      passed,
      failed,
      pending,
      overallScore: overallScore * 100,
      categoryScores,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

