import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Validações da Janela / Rota Dedicada de Login (/login)', async (t) => {
    const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
    const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf-8');
    const stylesCss = fs.readFileSync(path.join(__dirname, '../styles.css'), 'utf-8');

    await t.test('1. Estrutura HTML: Deve conter #loginViewWrapper, hero com nome da empresa e caixa de login', () => {
        assert.ok(indexHtml.includes('id="loginViewWrapper"'), 'Deve conter #loginViewWrapper');
        assert.ok(indexHtml.includes('id="loginViewStoreName"'), 'Deve conter #loginViewStoreName para o nome da empresa');
        assert.ok(indexHtml.includes('id="dedicatedLoginForm"'), 'Deve conter #dedicatedLoginForm para autenticação');
        assert.ok(indexHtml.includes('id="dedicatedLoginEmail"'), 'Deve conter input de e-mail');
        assert.ok(indexHtml.includes('id="dedicatedLoginPassword"'), 'Deve conter input de senha');
        assert.ok(indexHtml.includes('id="btnDedicatedLoginSubmit"'), 'Deve conter botão de envio');
        assert.ok(indexHtml.includes('id="loginAlreadyLoggedBox"'), 'Deve conter card informativo para lojista já conectado');
    });

    await t.test('2. Estilos CSS: Deve conter classes para .login-view-wrapper, .login-welcome-title e .login-card-box', () => {
        assert.ok(stylesCss.includes('.login-view-wrapper'), 'Deve conter regras para .login-view-wrapper');
        assert.ok(stylesCss.includes('.login-welcome-title'), 'Deve conter regras para .login-welcome-title');
        assert.ok(stylesCss.includes('.login-card-box'), 'Deve conter regras para .login-card-box');
        assert.ok(stylesCss.includes('.btn-dedicated-login-submit'), 'Deve conter estilos para o botão de login dedicado');
        assert.ok(stylesCss.includes('.login-highlight-store-name'), 'Deve conter destaque para o nome da empresa');
    });

    await t.test('3. JavaScript SPA: Deve implementar switchToLoginView, detecção de rota /login e refreshDedicatedLoginUI', () => {
        assert.ok(appJs.includes('function switchToLoginView'), 'Deve definir switchToLoginView');
        assert.ok(appJs.includes('function refreshDedicatedLoginUI'), 'Deve definir refreshDedicatedLoginUI');
        assert.ok(appJs.includes('window.switchToLoginView = switchToLoginView'), 'Deve expor switchToLoginView no window');
        assert.ok(appJs.includes('/login'), 'Deve tratar a rota /login');
        assert.ok(appJs.includes('dedicatedLoginForm'), 'Deve conter listener de envio do formulário dedicado');
    });
});
