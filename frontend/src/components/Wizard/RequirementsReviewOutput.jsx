import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Specialized component for rendering Requirements Review output
 * with collapsible sections for better readability
 */
export default function RequirementsReviewOutput({ output }) {
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    scorecard: true,
    critical: true,
    gaps: true,
    nfr: true,
    recommendations: true,
    stories: true,
    approval: true,
  });

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: isExpanded,
    }));
  };

  // Parse the markdown output into sections
  const sections = parseReviewSections(output);

  return (
    <Box>
      {/* Executive Summary - Always visible */}
      <Accordion
        expanded={expandedSections.summary}
        onChange={handleAccordionChange('summary')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">📋 Executive Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ p: 1 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sections.summary || 'No summary available'}
            </ReactMarkdown>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Requirements Quality Scorecard */}
      <Accordion
        expanded={expandedSections.scorecard}
        onChange={handleAccordionChange('scorecard')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}
        >
          <Typography variant="h6">🎯 Requirements Quality Scorecard</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ p: 1 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sections.scorecard || 'No scorecard available'}
            </ReactMarkdown>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Critical Issues */}
      {sections.critical && (
        <Accordion
          expanded={expandedSections.critical}
          onChange={handleAccordionChange('critical')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}
          >
            <Typography variant="h6">🔴 Critical Issues</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 1 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sections.critical}
              </ReactMarkdown>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Important Gaps */}
      {sections.gaps && (
        <Accordion
          expanded={expandedSections.gaps}
          onChange={handleAccordionChange('gaps')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}
          >
            <Typography variant="h6">⚠️ Important Gaps</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 1 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sections.gaps}
              </ReactMarkdown>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Non-Functional Requirements */}
      {sections.nfr && (
        <Accordion
          expanded={expandedSections.nfr}
          onChange={handleAccordionChange('nfr')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}
          >
            <Typography variant="h6">🔧 Non-Functional Requirements</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 1 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sections.nfr}
              </ReactMarkdown>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Top Recommendations */}
      {sections.recommendations && (
        <Accordion
          expanded={expandedSections.recommendations}
          onChange={handleAccordionChange('recommendations')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}
          >
            <Typography variant="h6">💡 Top Recommendations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 1 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sections.recommendations}
              </ReactMarkdown>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Suggested Additional User Stories */}
      {sections.stories && (
        <Accordion
          expanded={expandedSections.stories}
          onChange={handleAccordionChange('stories')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}
          >
            <Typography variant="h6">📝 Suggested Additional User Stories</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 1 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sections.stories}
              </ReactMarkdown>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Final Approval Status */}
      <Accordion
        expanded={expandedSections.approval}
        onChange={handleAccordionChange('approval')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            bgcolor: getApprovalColor(sections.approval),
            color: 'white',
          }}
        >
          <Typography variant="h6">✅ Final Approval Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ p: 1 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sections.approval || 'No approval status available'}
            </ReactMarkdown>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

/**
 * Parse the markdown output into logical sections
 */
function parseReviewSections(output) {
  const sections = {
    summary: '',
    scorecard: '',
    critical: '',
    gaps: '',
    nfr: '',
    recommendations: '',
    stories: '',
    approval: '',
  };

  // Split by headers
  const summaryMatch = output.match(/## 📋 Executive Summary([\s\S]*?)(?=##|$)/);
  const scorecardMatch = output.match(/## 🎯 Requirements Quality Scorecard([\s\S]*?)(?=##|$)/);
  const criticalMatch = output.match(/## 🔴 Critical Issues[\s\S]*?\n([\s\S]*?)(?=##|$)/);
  const gapsMatch = output.match(/## ⚠️ Important Gaps[\s\S]*?\n([\s\S]*?)(?=##|$)/);
  const nfrMatch = output.match(/## 🔧 Non-Functional Requirements Review([\s\S]*?)(?=##|$)/);
  const recommendationsMatch = output.match(/## 💡 Top Recommendations([\s\S]*?)(?=##|$)/);
  const storiesMatch = output.match(/## 📝 Suggested Additional User Stories([\s\S]*?)(?=##|$)/);
  const approvalMatch = output.match(/## ✅ Final Approval Status([\s\S]*?)(?=##|$)/);

  if (summaryMatch) sections.summary = summaryMatch[1].trim();
  if (scorecardMatch) sections.scorecard = scorecardMatch[1].trim();
  if (criticalMatch) sections.critical = criticalMatch[1].trim();
  if (gapsMatch) sections.gaps = gapsMatch[1].trim();
  if (nfrMatch) sections.nfr = nfrMatch[1].trim();
  if (recommendationsMatch) sections.recommendations = recommendationsMatch[1].trim();
  if (storiesMatch) sections.stories = storiesMatch[1].trim();
  if (approvalMatch) sections.approval = approvalMatch[1].trim();

  return sections;
}

/**
 * Determine the color for the approval status based on content
 */
function getApprovalColor(approvalText) {
  if (!approvalText) return 'grey.600';

  if (approvalText.includes('✅') || approvalText.includes('Approved') && !approvalText.includes('Conditions')) {
    return 'success.main';
  }
  if (approvalText.includes('⚠️') || approvalText.includes('Conditions')) {
    return 'warning.main';
  }
  if (approvalText.includes('❌') || approvalText.includes('Revision')) {
    return 'error.main';
  }

  return 'grey.600';
}