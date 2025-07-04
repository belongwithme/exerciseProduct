<!-- 用户档案调试组件 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { user, userProfile } from '../../stores/auth';
  import { supabase } from '../../utils/supabaseClient';

  let debugInfo = '';
  let isLoading = false;
  let profiles: any[] = [];
  let authUsers: any[] = [];

  $: currentUser = $user;
  $: currentProfile = $userProfile;

  onMount(() => {
    loadDebugInfo();
  });

  async function loadDebugInfo() {
    isLoading = true;
    debugInfo = '';
    
    try {
      // 获取当前会话信息
      const { data: sessionData } = await supabase.auth.getSession();
      debugInfo += `=== 当前会话信息 ===\n`;
      debugInfo += `用户ID: ${sessionData.session?.user?.id || '未登录'}\n`;
      debugInfo += `邮箱: ${sessionData.session?.user?.email || '无'}\n`;
      debugInfo += `邮箱已确认: ${sessionData.session?.user?.email_confirmed_at ? '是' : '否'}\n`;
      debugInfo += `创建时间: ${sessionData.session?.user?.created_at || '无'}\n`;
      debugInfo += `元数据: ${JSON.stringify(sessionData.session?.user?.user_metadata || {}, null, 2)}\n\n`;

      // 获取所有profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        debugInfo += `=== Profiles表查询错误 ===\n${profilesError.message}\n\n`;
      } else {
        profiles = profilesData || [];
        debugInfo += `=== Profiles表数据 (${profiles.length}条记录) ===\n`;
        profiles.forEach((profile, index) => {
          debugInfo += `${index + 1}. ID: ${profile.id}\n`;
          debugInfo += `   用户名: ${profile.username}\n`;
          debugInfo += `   全名: ${profile.full_name}\n`;
          debugInfo += `   创建时间: ${profile.created_at}\n`;
          debugInfo += `   身高: ${profile.height_cm || '未填写'}\n`;
          debugInfo += `   体重: ${profile.weight_kg || '未填写'}\n\n`;
        });
      }

      // 检查触发器状态
      const { data: triggerData, error: triggerError } = await supabase
        .rpc('check_trigger_exists', { trigger_name: 'on_auth_user_created' })
        .single();

      if (triggerError) {
        debugInfo += `=== 触发器检查错误 ===\n${triggerError.message}\n\n`;
      } else {
        debugInfo += `=== 触发器状态 ===\n`;
        debugInfo += `触发器存在: ${triggerData ? '是' : '否'}\n\n`;
      }

         } catch (error) {
       debugInfo += `=== 调试信息加载错误 ===\n${error instanceof Error ? error.message : String(error)}\n\n`;
     } finally {
      isLoading = false;
    }
  }

  async function createProfileManually() {
    if (!currentUser) {
      alert('请先登录');
      return;
    }

    const username = prompt('请输入用户名:', `user_${currentUser.id.substring(0, 8)}`);
    if (!username) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: currentUser.id,
            username: username,
            full_name: username,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        alert(`创建档案失败: ${error.message}`);
      } else {
        alert('档案创建成功！');
        loadDebugInfo();
      }
         } catch (error) {
       alert(`创建档案错误: ${error instanceof Error ? error.message : String(error)}`);
     }
  }

  async function deleteProfile(profileId: string) {
    if (!confirm('确定要删除这个档案吗？')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        alert(`删除档案失败: ${error.message}`);
      } else {
        alert('档案删除成功！');
        loadDebugInfo();
      }
    } catch (error) {
      alert(`删除档案错误: ${error.message}`);
    }
  }

  async function runTriggerFix() {
    if (!confirm('确定要运行触发器修复脚本吗？')) return;

    try {
      // 这里需要手动执行SQL脚本
      alert('请在Supabase SQL编辑器中运行 fix-trigger.sql 脚本');
    } catch (error) {
      alert(`修复触发器错误: ${error.message}`);
    }
  }
</script>

<div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">用户档案调试工具</h2>
    <p class="text-gray-600">用于排查注册和档案创建问题</p>
  </div>

  <!-- 当前状态 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div class="bg-blue-50 p-4 rounded-lg">
      <h3 class="font-semibold text-blue-800 mb-2">当前用户状态</h3>
      <p class="text-sm">登录状态: {currentUser ? '已登录' : '未登录'}</p>
      {#if currentUser}
        <p class="text-sm">用户ID: {currentUser.id}</p>
        <p class="text-sm">邮箱: {currentUser.email}</p>
      {/if}
    </div>

    <div class="bg-green-50 p-4 rounded-lg">
      <h3 class="font-semibold text-green-800 mb-2">档案状态</h3>
      <p class="text-sm">档案存在: {currentProfile ? '是' : '否'}</p>
      {#if currentProfile}
        <p class="text-sm">用户名: {currentProfile.username}</p>
        <p class="text-sm">全名: {currentProfile.full_name}</p>
      {/if}
    </div>
  </div>

  <!-- 操作按钮 -->
  <div class="flex flex-wrap gap-3 mb-6">
    <button
      on:click={loadDebugInfo}
      disabled={isLoading}
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? '加载中...' : '刷新调试信息'}
    </button>

    <button
      on:click={createProfileManually}
      disabled={!currentUser || currentProfile}
      class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
    >
      手动创建档案
    </button>

    <button
      on:click={runTriggerFix}
      class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
    >
      修复触发器
    </button>
  </div>

  <!-- 调试信息 -->
  <div class="mb-6">
    <h3 class="font-semibold text-gray-800 mb-3">详细调试信息</h3>
    <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">{debugInfo}</pre>
  </div>

  <!-- 档案列表 -->
  {#if profiles.length > 0}
    <div>
      <h3 class="font-semibold text-gray-800 mb-3">所有用户档案</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">全名</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each profiles as profile}
              <tr>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {profile.id.substring(0, 8)}...
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {profile.username}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {profile.full_name}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(profile.created_at).toLocaleString()}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  <button
                    on:click={() => deleteProfile(profile.id)}
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div> 